'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function TherapeutDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('overzicht');
  const [loading, setLoading] = useState(true);

  // Data states
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessionNotes, setSessionNotes] = useState([]);
  const [insights, setInsights] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form states
  const [newNote, setNewNote] = useState({ summary: '', key_points: '', homework: '', next_focus: '' });
  const [newInsight, setNewInsight] = useState({ type: 'tip', content: '' });
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user && profile) {
      loadAllData();
      subscribeToMessages();
    }
  }, [user, profile]);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientData(selectedPatient.id);
    }
  }, [selectedPatient]);

  async function loadUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          // Check if user is therapist
          if (profileData.role !== 'therapist') {
            window.location.href = '/portal';
            return;
          }
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAllData() {
    // Load only patients assigned to this therapist
    const { data: patientsData } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient')
      .eq('therapist_id', user.id);
    
    if (patientsData) setPatients(patientsData);
  }

  async function loadPatientData(patientId) {
    // Load session notes for patient
    const { data: notesData } = await supabase
      .from('session_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('session_date', { ascending: false });
    if (notesData) setSessionNotes(notesData);

    // Load AI insights for patient
    const { data: insightsData } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    if (insightsData) setInsights(insightsData);

    // Load reports for patient
    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    if (reportsData) setReports(reportsData);

    // Load messages with patient
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${patientId},receiver_id.eq.${patientId}`)
      .order('created_at', { ascending: true });
    if (messagesData) setMessages(messagesData);
  }

  function subscribeToMessages() {
    const channel = supabase
      .channel('therapist-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        if (selectedPatient && 
            (payload.new.sender_id === selectedPatient.id || 
             payload.new.receiver_id === selectedPatient.id)) {
          setMessages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  // Add session note
  async function addSessionNote() {
    if (!selectedPatient || !newNote.summary) return;

    const { error } = await supabase
      .from('session_notes')
      .insert({
        patient_id: selectedPatient.id,
        therapist_id: user.id,
        session_date: new Date().toISOString().split('T')[0],
        summary: newNote.summary,
        key_points: newNote.key_points.split('\n').filter(p => p.trim()),
        homework: newNote.homework,
        next_focus: newNote.next_focus
      });

    if (!error) {
      setNewNote({ summary: '', key_points: '', homework: '', next_focus: '' });
      loadPatientData(selectedPatient.id);
    }
  }

  // Add AI insight
  async function addInsight() {
    if (!selectedPatient || !newInsight.content) return;

    const { error } = await supabase
      .from('ai_insights')
      .insert({
        patient_id: selectedPatient.id,
        type: newInsight.type,
        content: newInsight.content,
        is_read: false
      });

    if (!error) {
      setNewInsight({ type: 'tip', content: '' });
      loadPatientData(selectedPatient.id);
    }
  }

  // Upload report
  async function uploadReport(e) {
    const file = e.target.files[0];
    if (!file || !selectedPatient) return;

    const { error } = await supabase
      .from('reports')
      .insert({
        patient_id: selectedPatient.id,
        title: file.name,
        file_url: `https://storage.example.com/${file.name}`,
        is_new: true
      });

    if (!error) {
      loadPatientData(selectedPatient.id);
    }
  }

  // Send message
  async function sendMessage() {
    if (!selectedPatient || !newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: selectedPatient.id,
        content: newMessage.trim()
      });

    if (!error) {
      setNewMessage('');
    }
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !profile || profile.role !== 'therapist') {
    return <div style={styles.container}><p>Geen toegang. Je moet ingelogd zijn als therapeut.</p></div>;
  }

  const menuItems = [
    { id: 'overzicht', label: 'Overzicht', icon: '🏠' },
    { id: 'patienten', label: 'Mijn Patiënten', icon: '👥' },
    { id: 'notities', label: 'Sessie Notities', icon: '📝' },
    { id: 'inzichten', label: 'AI Inzichten', icon: '💡' },
    { id: 'rapporten', label: 'Rapporten', icon: '📄' },
    { id: 'berichten', label: 'Berichten', icon: '💬' },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🌿</span>
          <span style={styles.logoText}>Dynamic Parenting</span>
        </div>
        
        {/* Role Badge */}
        <div style={styles.roleBadge}>
          👩‍⚕️ Therapeut Portal
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                ...styles.navItem,
                ...(activeSection === item.id ? styles.navItemActive : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={styles.userSection}>
          <div style={styles.userAvatar}>👩‍⚕️</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{profile?.full_name || 'Therapeut'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Uitloggen</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {activeSection === 'overzicht' && <OverzichtSection patients={patients} />}
        {activeSection === 'patienten' && (
          <PatientenSection 
            patients={patients} 
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
          />
        )}
        {activeSection === 'notities' && (
          <NotitiesSection 
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            sessionNotes={sessionNotes}
            newNote={newNote}
            setNewNote={setNewNote}
            addSessionNote={addSessionNote}
          />
        )}
        {activeSection === 'inzichten' && (
          <InzichtenSection 
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            insights={insights}
            newInsight={newInsight}
            setNewInsight={setNewInsight}
            addInsight={addInsight}
          />
        )}
        {activeSection === 'rapporten' && (
          <RapportenSection 
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            reports={reports}
            uploadReport={uploadReport}
          />
        )}
        {activeSection === 'berichten' && (
          <BerichtenSection 
            patients={patients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            userId={user.id}
            messagesEndRef={messagesEndRef}
          />
        )}
      </main>
    </div>
  );
}

// Loading Screen
function LoadingScreen() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p>Laden...</p>
    </div>
  );
}

// Patient Selector Component
function PatientSelector({ patients, selectedPatient, setSelectedPatient }) {
  return (
    <div style={styles.patientSelector}>
      <label style={styles.selectorLabel}>Selecteer patiënt:</label>
      <select 
        value={selectedPatient?.id || ''} 
        onChange={(e) => {
          const patient = patients.find(p => p.id === e.target.value);
          setSelectedPatient(patient);
        }}
        style={styles.select}
      >
        <option value="">-- Kies een patiënt --</option>
        {patients.map(p => (
          <option key={p.id} value={p.id}>
            {p.full_name || p.email}
          </option>
        ))}
      </select>
    </div>
  );
}

// Overzicht Section
function OverzichtSection({ patients }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>🏠 Overzicht</h1>
      <p style={styles.pageDesc}>Welkom terug! Hier is een overzicht van je praktijk.</p>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>👥</span>
          <span style={styles.statNumber}>{patients.length}</span>
          <span style={styles.statLabel}>Mijn Patiënten</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📅</span>
          <span style={styles.statNumber}>-</span>
          <span style={styles.statLabel}>Afspraken vandaag</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>💬</span>
          <span style={styles.statNumber}>-</span>
          <span style={styles.statLabel}>Ongelezen berichten</span>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Mijn patiënten</h3>
        {patients.length === 0 ? (
          <p style={styles.emptyText}>Nog geen patiënten aan jou toegewezen.</p>
        ) : (
          <ul style={styles.patientList}>
            {patients.slice(0, 5).map(p => (
              <li key={p.id} style={styles.patientListItem}>
                <span style={styles.patientAvatar}>👤</span>
                <span>{p.full_name || p.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Patiënten Section
function PatientenSection({ patients, selectedPatient, setSelectedPatient }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>👥 Mijn Patiënten</h1>
      <p style={styles.pageDesc}>Beheer je patiënten en bekijk hun voortgang.</p>

      <div style={styles.patientGrid}>
        {patients.map(patient => (
          <div 
            key={patient.id} 
            style={{
              ...styles.patientCard,
              ...(selectedPatient?.id === patient.id ? styles.patientCardSelected : {})
            }}
            onClick={() => setSelectedPatient(patient)}
          >
            <div style={styles.patientCardAvatar}>👤</div>
            <h3 style={styles.patientCardName}>{patient.full_name || 'Geen naam'}</h3>
            <p style={styles.patientCardEmail}>{patient.email}</p>
          </div>
        ))}
      </div>

      {patients.length === 0 && (
        <div style={styles.emptyState}>
          <p>Nog geen patiënten aan jou toegewezen.</p>
          <p style={styles.emptyHint}>Patiënten worden gekoppeld via de admin.</p>
        </div>
      )}
    </div>
  );
}

// Notities Section
function NotitiesSection({ patients, selectedPatient, setSelectedPatient, sessionNotes, newNote, setNewNote, addSessionNote }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📝 Sessie Notities</h1>
      <p style={styles.pageDesc}>Voeg sessie notities toe voor je patiënten.</p>

      <PatientSelector 
        patients={patients} 
        selectedPatient={selectedPatient} 
        setSelectedPatient={setSelectedPatient} 
      />

      {selectedPatient && (
        <>
          {/* Add new note form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Nieuwe notitie voor {selectedPatient.full_name}</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Samenvatting sessie:</label>
              <textarea
                value={newNote.summary}
                onChange={(e) => setNewNote({...newNote, summary: e.target.value})}
                style={styles.textarea}
                placeholder="Beschrijf de sessie..."
                rows={4}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Belangrijke punten (één per regel):</label>
              <textarea
                value={newNote.key_points}
                onChange={(e) => setNewNote({...newNote, key_points: e.target.value})}
                style={styles.textarea}
                placeholder="• Punt 1&#10;• Punt 2&#10;• Punt 3"
                rows={3}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Huiswerk:</label>
                <input
                  type="text"
                  value={newNote.homework}
                  onChange={(e) => setNewNote({...newNote, homework: e.target.value})}
                  style={styles.input}
                  placeholder="Opdracht voor de patiënt"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Focus volgende sessie:</label>
                <input
                  type="text"
                  value={newNote.next_focus}
                  onChange={(e) => setNewNote({...newNote, next_focus: e.target.value})}
                  style={styles.input}
                  placeholder="Onderwerp volgende keer"
                />
              </div>
            </div>

            <button onClick={addSessionNote} style={styles.primaryBtn}>
              📝 Notitie opslaan
            </button>
          </div>

          {/* Existing notes */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Eerdere notities</h3>
            {sessionNotes.length === 0 ? (
              <p style={styles.emptyText}>Nog geen notities voor deze patiënt.</p>
            ) : (
              <div style={styles.notesList}>
                {sessionNotes.map(note => (
                  <div key={note.id} style={styles.noteCard}>
                    <div style={styles.noteHeader}>
                      <span style={styles.noteDate}>📅 {new Date(note.session_date).toLocaleDateString('nl-NL')}</span>
                    </div>
                    <p style={styles.noteSummary}>{note.summary}</p>
                    {note.key_points && note.key_points.length > 0 && (
                      <ul style={styles.notePoints}>
                        {note.key_points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                    {note.homework && <p style={styles.noteHomework}>📚 Huiswerk: {note.homework}</p>}
                    {note.next_focus && <p style={styles.noteFocus}>🎯 Volgende keer: {note.next_focus}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Inzichten Section
function InzichtenSection({ patients, selectedPatient, setSelectedPatient, insights, newInsight, setNewInsight, addInsight }) {
  const insightTypes = [
    { value: 'positive', label: '✅ Positief', color: '#10b981' },
    { value: 'pattern', label: '🔄 Patroon', color: '#3b82f6' },
    { value: 'tip', label: '💡 Tip', color: '#f59e0b' },
    { value: 'warning', label: '⚠️ Aandachtspunt', color: '#ef4444' },
  ];

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>💡 AI Inzichten</h1>
      <p style={styles.pageDesc}>Voeg inzichten en tips toe voor je patiënten.</p>

      <PatientSelector 
        patients={patients} 
        selectedPatient={selectedPatient} 
        setSelectedPatient={setSelectedPatient} 
      />

      {selectedPatient && (
        <>
          {/* Add new insight form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Nieuw inzicht voor {selectedPatient.full_name}</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Type:</label>
              <div style={styles.typeButtons}>
                {insightTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setNewInsight({...newInsight, type: type.value})}
                    style={{
                      ...styles.typeBtn,
                      backgroundColor: newInsight.type === type.value ? type.color : '#f1f5f9',
                      color: newInsight.type === type.value ? 'white' : '#334155'
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Inhoud:</label>
              <textarea
                value={newInsight.content}
                onChange={(e) => setNewInsight({...newInsight, content: e.target.value})}
                style={styles.textarea}
                placeholder="Schrijf je inzicht of tip..."
                rows={4}
              />
            </div>

            <button onClick={addInsight} style={styles.primaryBtn}>
              💡 Inzicht opslaan
            </button>
          </div>

          {/* Existing insights */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Eerdere inzichten</h3>
            {insights.length === 0 ? (
              <p style={styles.emptyText}>Nog geen inzichten voor deze patiënt.</p>
            ) : (
              <div style={styles.insightsList}>
                {insights.map(insight => {
                  const typeInfo = insightTypes.find(t => t.value === insight.type) || insightTypes[2];
                  return (
                    <div 
                      key={insight.id} 
                      style={{
                        ...styles.insightCard,
                        borderLeftColor: typeInfo.color
                      }}
                    >
                      <div style={styles.insightHeader}>
                        <span style={{...styles.insightType, backgroundColor: typeInfo.color}}>
                          {typeInfo.label}
                        </span>
                        <span style={styles.insightDate}>
                          {new Date(insight.created_at).toLocaleDateString('nl-NL')}
                        </span>
                      </div>
                      <p style={styles.insightContent}>{insight.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Rapporten Section
function RapportenSection({ patients, selectedPatient, setSelectedPatient, reports, uploadReport }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📄 Rapporten</h1>
      <p style={styles.pageDesc}>Upload en beheer rapporten voor je patiënten.</p>

      <PatientSelector 
        patients={patients} 
        selectedPatient={selectedPatient} 
        setSelectedPatient={setSelectedPatient} 
      />

      {selectedPatient && (
        <>
          {/* Upload form */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Rapport uploaden voor {selectedPatient.full_name}</h3>
            <div style={styles.uploadArea}>
              <input
                type="file"
                onChange={uploadReport}
                style={styles.fileInput}
                id="reportUpload"
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="reportUpload" style={styles.uploadLabel}>
                📁 Klik om een bestand te selecteren
              </label>
              <p style={styles.uploadHint}>PDF, DOC of DOCX (max 10MB)</p>
            </div>
          </div>

          {/* Existing reports */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Geüploade rapporten</h3>
            {reports.length === 0 ? (
              <p style={styles.emptyText}>Nog geen rapporten voor deze patiënt.</p>
            ) : (
              <div style={styles.reportsList}>
                {reports.map(report => (
                  <div key={report.id} style={styles.reportCard}>
                    <span style={styles.reportIcon}>📄</span>
                    <div style={styles.reportInfo}>
                      <span style={styles.reportTitle}>{report.title}</span>
                      <span style={styles.reportDate}>
                        {new Date(report.created_at).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                    {report.is_new && <span style={styles.newBadge}>Nieuw</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Berichten Section
function BerichtenSection({ patients, selectedPatient, setSelectedPatient, messages, newMessage, setNewMessage, sendMessage, userId, messagesEndRef }) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>💬 Berichten</h1>
      <p style={styles.pageDesc}>Communiceer met je patiënten.</p>

      <PatientSelector 
        patients={patients} 
        selectedPatient={selectedPatient} 
        setSelectedPatient={setSelectedPatient} 
      />

      {selectedPatient && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <span style={styles.chatAvatar}>👤</span>
            <span style={styles.chatName}>{selectedPatient.full_name || selectedPatient.email}</span>
          </div>

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <p style={styles.emptyText}>Nog geen berichten. Start een gesprek!</p>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id} 
                  style={{
                    ...styles.message,
                    ...(msg.sender_id === userId ? styles.messageSent : styles.messageReceived)
                  }}
                >
                  <p style={styles.messageContent}>{msg.content}</p>
                  <span style={styles.messageTime}>
                    {new Date(msg.created_at).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.chatInputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              style={styles.chatInput}
              placeholder="Typ je bericht..."
            />
            <button onClick={sendMessage} style={styles.sendBtn}>
              Verstuur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  
  // Sidebar
  sidebar: {
    width: '260px',
    backgroundColor: '#1e3a5f',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
  },
  logo: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: { fontSize: '28px' },
  logoText: { fontSize: '18px', fontWeight: '600', color: '#5cb85c' },
  roleBadge: {
    margin: '16px 20px',
    padding: '10px 16px',
    backgroundColor: 'rgba(92, 184, 92, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#5cb85c',
    textAlign: 'center',
  },
  nav: { flex: 1, padding: '8px 0' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '14px 24px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '15px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderLeft: '3px solid #5cb85c',
  },
  navIcon: { fontSize: '18px' },
  userSection: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  userInfo: { display: 'flex', flexDirection: 'column' },
  userName: { fontSize: '14px', fontWeight: '500' },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
  },

  // Main
  main: {
    flex: 1,
    marginLeft: '260px',
    padding: '32px',
  },
  section: { maxWidth: '1000px' },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: '8px',
  },
  pageDesc: { color: '#64748b', marginBottom: '32px' },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statIcon: { fontSize: '32px', marginBottom: '8px' },
  statNumber: { fontSize: '36px', fontWeight: '700', color: '#1e3a5f' },
  statLabel: { color: '#64748b', fontSize: '14px' },

  // Cards
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: '16px',
  },

  // Patient selector
  patientSelector: { marginBottom: '24px' },
  selectorLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#334155',
  },
  select: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },

  // Patient grid
  patientGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  },
  patientCardSelected: {
    borderColor: '#1e3a5f',
    boxShadow: '0 4px 12px rgba(30,58,95,0.2)',
  },
  patientCardAvatar: { fontSize: '48px', marginBottom: '12px' },
  patientCardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: '4px',
  },
  patientCardEmail: { fontSize: '13px', color: '#64748b' },

  // Forms
  formGroup: { marginBottom: '20px' },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  primaryBtn: {
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  // Type buttons
  typeButtons: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  typeBtn: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },

  // Notes
  notesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  noteCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid #1e3a5f',
  },
  noteHeader: { marginBottom: '8px' },
  noteDate: { fontSize: '13px', color: '#64748b' },
  noteSummary: { color: '#334155', marginBottom: '12px', lineHeight: '1.6' },
  notePoints: { marginLeft: '20px', color: '#475569', marginBottom: '12px' },
  noteHomework: {
    fontSize: '14px',
    color: '#1e3a5f',
    backgroundColor: '#e0f2fe',
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  noteFocus: {
    fontSize: '14px',
    color: '#166534',
    backgroundColor: '#dcfce7',
    padding: '8px 12px',
    borderRadius: '6px',
  },

  // Insights
  insightsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  insightCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    borderLeft: '4px solid',
  },
  insightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  insightType: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  insightDate: { fontSize: '13px', color: '#64748b' },
  insightContent: { color: '#334155', lineHeight: '1.6' },

  // Reports
  uploadArea: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
  },
  fileInput: { display: 'none' },
  uploadLabel: {
    display: 'block',
    fontSize: '16px',
    color: '#1e3a5f',
    cursor: 'pointer',
    marginBottom: '8px',
  },
  uploadHint: { fontSize: '13px', color: '#64748b' },
  reportsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reportCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  reportIcon: { fontSize: '24px' },
  reportInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  reportTitle: { fontWeight: '500', color: '#334155' },
  reportDate: { fontSize: '13px', color: '#64748b' },
  newBadge: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },

  // Chat
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  chatHeader: {
    backgroundColor: '#1e3a5f',
    color: 'white',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  chatAvatar: { fontSize: '24px' },
  chatName: { fontWeight: '500' },
  messagesContainer: {
    height: '400px',
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f8fafc',
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    marginBottom: '12px',
  },
  messageSent: {
    backgroundColor: '#1e3a5f',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: '4px',
  },
  messageReceived: {
    backgroundColor: 'white',
    color: '#334155',
    marginRight: 'auto',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  messageContent: { margin: 0, lineHeight: '1.5' },
  messageTime: { fontSize: '11px', opacity: 0.7, display: 'block', marginTop: '4px' },
  chatInputContainer: {
    display: 'flex',
    padding: '16px',
    gap: '12px',
    borderTop: '1px solid #e2e8f0',
  },
  chatInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '24px',
    outline: 'none',
    fontSize: '15px',
  },
  sendBtn: {
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: '600',
  },

  // Empty states
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
  },
  emptyHint: {
    fontSize: '14px',
    marginTop: '8px',
    color: '#94a3b8',
  },
  emptyText: { color: '#64748b', fontStyle: 'italic' },
  patientList: { listStyle: 'none', padding: 0, margin: 0 },
  patientListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  patientAvatar: { fontSize: '20px' },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#64748b',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTopColor: '#1e3a5f',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};
