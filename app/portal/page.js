'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [activeSection, setActiveSection] = useState('overzicht');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [progressData, setProgressData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [sessionNotes, setSessionNotes] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadAllData();
      subscribeToMessages();
    }
  }, [user]);

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
          // Redirect therapists to their portal
          if (profileData.role === 'therapist') {
            window.location.href = '/therapeut';
            return;
          }
          // Load therapist info
          if (profileData.therapist_id) {
            const { data: therapistData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', profileData.therapist_id)
              .single();
            if (therapistData) setTherapist(therapistData);
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
    // Load progress data
    const { data: progress } = await supabase
      .from('progress_data')
      .select('*')
      .eq('patient_id', user.id)
      .order('date', { ascending: false })
      .limit(30);
    if (progress) setProgressData(progress);

    // Load AI insights
    const { data: insightsData } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });
    if (insightsData) setInsights(insightsData);

    // Load session notes
    const { data: notes } = await supabase
      .from('session_notes')
      .select('*')
      .eq('patient_id', user.id)
      .order('session_date', { ascending: false });
    if (notes) setSessionNotes(notes);

    // Load questionnaires
    const { data: questionnaireData } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('is_active', true);
    if (questionnaireData) setQuestionnaires(questionnaireData);

    // Load reports
    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });
    if (reportsData) setReports(reportsData);

    // Load messages
    if (profile?.therapist_id) {
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
      if (messagesData) setMessages(messagesData);
    }
  }

  function subscribeToMessages() {
    const channel = supabase
      .channel('patient-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        if (payload.new.sender_id === user.id || payload.new.receiver_id === user.id) {
          setMessages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !profile?.therapist_id) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: profile.therapist_id,
        content: newMessage.trim()
      });

    if (!error) {
      setNewMessage('');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !profile) {
    return <div style={styles.container}><p>Laden...</p></div>;
  }

  const menuItems = [
    { id: 'overzicht', label: 'Overzicht', icon: '🏠' },
    { id: 'voortgang', label: 'Mijn Voortgang', icon: '📊' },
    { id: 'inzichten', label: 'AI Inzichten', icon: '💡' },
    { id: 'notities', label: 'Sessie Notities', icon: '📝' },
    { id: 'vragenlijsten', label: 'Vragenlijsten', icon: '📋' },
    { id: 'rapporten', label: 'Rapporten', icon: '📄' },
    { id: 'afspraken', label: 'Afspraken', icon: '📅' },
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
          <div style={styles.userAvatar}>👤</div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{profile?.full_name || 'Patiënt'}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Uitloggen</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Therapist Info Banner */}
        {therapist && (
          <div style={styles.therapistBanner}>
            <span style={styles.therapistIcon}>👩‍⚕️</span>
            <div>
              <span style={styles.therapistLabel}>Jouw therapeut:</span>
              <span style={styles.therapistName}>{therapist.full_name}</span>
            </div>
          </div>
        )}

        {activeSection === 'overzicht' && (
          <OverzichtSection 
            profile={profile} 
            therapist={therapist}
            progressData={progressData}
            insights={insights}
          />
        )}
        {activeSection === 'voortgang' && <VoortgangSection progressData={progressData} />}
        {activeSection === 'inzichten' && <InzichtenSection insights={insights} />}
        {activeSection === 'notities' && <NotitiesSection sessionNotes={sessionNotes} />}
        {activeSection === 'vragenlijsten' && <VragenlijstenSection questionnaires={questionnaires} />}
        {activeSection === 'rapporten' && <RapportenSection reports={reports} />}
        {activeSection === 'afspraken' && <AfsprakenSection />}
        {activeSection === 'berichten' && (
          <BerichtenSection 
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            userId={user.id}
            therapist={therapist}
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

// Overzicht Section
function OverzichtSection({ profile, therapist, progressData, insights }) {
  const latestProgress = progressData[0];
  
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>Welkom terug, {profile?.full_name?.split(' ')[0] || 'daar'}! 👋</h1>
      
      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statEmoji}>😌</span>
          <span style={styles.statNumber}>{latestProgress?.stress_level || '-'}/10</span>
          <span style={styles.statLabel}>Stress</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statEmoji}>⚡</span>
          <span style={styles.statNumber}>{latestProgress?.energy_level || '-'}/10</span>
          <span style={styles.statLabel}>Energie</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statEmoji}>🌟</span>
          <span style={styles.statNumber}>{latestProgress?.mood_score || '-'}/10</span>
          <span style={styles.statLabel}>Stemming</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Snelle acties</h3>
        <div style={styles.quickActions}>
          <button style={styles.actionBtn}>📋 Vragenlijst invullen</button>
          <button style={styles.actionBtn}>📅 Afspraak plannen</button>
          <button style={styles.actionBtn}>💬 Bericht sturen</button>
        </div>
      </div>

      {/* Latest Insight */}
      {insights.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>💡 Laatste inzicht</h3>
          <p style={styles.insightText}>{insights[0].content}</p>
        </div>
      )}
    </div>
  );
}

// Voortgang Section
function VoortgangSection({ progressData }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📊 Mijn Voortgang</h1>
      <p style={styles.pageDesc}>Bekijk je voortgang over tijd.</p>
      
      {progressData.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nog geen voortgangsdata beschikbaar.</p>
        </div>
      ) : (
        <div style={styles.progressList}>
          {progressData.map((entry, i) => (
            <div key={i} style={styles.progressCard}>
              <span style={styles.progressDate}>
                {new Date(entry.date).toLocaleDateString('nl-NL')}
              </span>
              <div style={styles.progressScores}>
                <span>😌 Stress: {entry.stress_level}/10</span>
                <span>⚡ Energie: {entry.energy_level}/10</span>
                <span>🌟 Stemming: {entry.mood_score}/10</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Inzichten Section
function InzichtenSection({ insights }) {
  const typeColors = {
    positive: '#10b981',
    pattern: '#3b82f6',
    tip: '#f59e0b',
    warning: '#ef4444'
  };

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>💡 AI Inzichten</h1>
      <p style={styles.pageDesc}>Persoonlijke inzichten van je therapeut.</p>
      
      {insights.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nog geen inzichten beschikbaar.</p>
        </div>
      ) : (
        <div style={styles.insightsList}>
          {insights.map(insight => (
            <div 
              key={insight.id} 
              style={{
                ...styles.insightCard,
                borderLeftColor: typeColors[insight.type] || '#64748b'
              }}
            >
              <p style={styles.insightContent}>{insight.content}</p>
              <span style={styles.insightDate}>
                {new Date(insight.created_at).toLocaleDateString('nl-NL')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Notities Section
function NotitiesSection({ sessionNotes }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📝 Sessie Notities</h1>
      <p style={styles.pageDesc}>Notities van je sessies met je therapeut.</p>
      
      {sessionNotes.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nog geen sessie notities beschikbaar.</p>
        </div>
      ) : (
        <div style={styles.notesList}>
          {sessionNotes.map(note => (
            <div key={note.id} style={styles.noteCard}>
              <div style={styles.noteHeader}>
                <span style={styles.noteDate}>
                  📅 {new Date(note.session_date).toLocaleDateString('nl-NL')}
                </span>
              </div>
              <p style={styles.noteSummary}>{note.summary}</p>
              {note.homework && (
                <div style={styles.noteHomework}>
                  📚 <strong>Huiswerk:</strong> {note.homework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Vragenlijsten Section
function VragenlijstenSection({ questionnaires }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📋 Vragenlijsten</h1>
      <p style={styles.pageDesc}>Vul vragenlijsten in om je voortgang bij te houden.</p>
      
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Beschikbare vragenlijsten</h3>
        {questionnaires.length === 0 ? (
          <p style={styles.emptyText}>Geen vragenlijsten beschikbaar.</p>
        ) : (
          <div style={styles.questionnaireList}>
            {questionnaires.map(q => (
              <div key={q.id} style={styles.questionnaireCard}>
                <span style={styles.questionnaireTitle}>{q.title}</span>
                <button style={styles.fillBtn}>Invullen</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Typeform embed placeholder */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Intake Vragenlijst</h3>
        <div style={styles.typeformContainer}>
          <iframe
            src="https://form.typeform.com/to/bM30pflI"
            style={styles.typeformIframe}
            title="Intake vragenlijst"
          />
        </div>
      </div>
    </div>
  );
}

// Rapporten Section
function RapportenSection({ reports }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📄 Rapporten</h1>
      <p style={styles.pageDesc}>Bekijk rapporten van je therapeut.</p>
      
      {reports.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nog geen rapporten beschikbaar.</p>
        </div>
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
  );
}

// Afspraken Section
function AfsprakenSection() {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📅 Afspraken</h1>
      <p style={styles.pageDesc}>Plan een afspraak met je therapeut.</p>
      
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Afspraak plannen</h3>
        <div style={styles.calendlyContainer}>
          <iframe
            src="https://calendly.com/walterzantinge/30min?embed_domain=dynamicparenting.vercel.app&embed_type=Inline"
            style={styles.calendlyIframe}
            title="Plan een afspraak"
          />
        </div>
      </div>
    </div>
  );
}

// Berichten Section
function BerichtenSection({ messages, newMessage, setNewMessage, sendMessage, userId, therapist, messagesEndRef }) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!therapist) {
    return (
      <div style={styles.section}>
        <h1 style={styles.pageTitle}>💬 Berichten</h1>
        <div style={styles.emptyState}>
          <p>Je bent nog niet gekoppeld aan een therapeut.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>💬 Berichten</h1>
      <p style={styles.pageDesc}>Chat met je therapeut.</p>

      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>
          <span style={styles.chatAvatar}>👩‍⚕️</span>
          <span style={styles.chatName}>{therapist.full_name}</span>
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
  nav: { flex: 1, padding: '16px 0' },
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

  // Therapist Banner
  therapistBanner: {
    backgroundColor: '#e0f2fe',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #7dd3fc',
  },
  therapistIcon: { fontSize: '32px' },
  therapistLabel: { 
    fontSize: '13px', 
    color: '#0369a1',
    display: 'block',
  },
  therapistName: { 
    fontSize: '18px', 
    fontWeight: '600', 
    color: '#0c4a6e',
    display: 'block',
  },

  section: { maxWidth: '900px' },
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
  statEmoji: { fontSize: '32px', marginBottom: '8px' },
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

  // Quick Actions
  quickActions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  actionBtn: {
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  // Insights
  insightText: { color: '#334155', lineHeight: '1.6' },
  insightsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    borderLeft: '4px solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  insightContent: { color: '#334155', lineHeight: '1.6', marginBottom: '8px' },
  insightDate: { fontSize: '13px', color: '#64748b' },

  // Progress
  progressList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  progressDate: { fontSize: '14px', fontWeight: '600', color: '#1e3a5f', display: 'block', marginBottom: '8px' },
  progressScores: { display: 'flex', gap: '20px', color: '#64748b', fontSize: '14px' },

  // Notes
  notesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #1e3a5f',
  },
  noteHeader: { marginBottom: '12px' },
  noteDate: { fontSize: '14px', color: '#64748b' },
  noteSummary: { color: '#334155', lineHeight: '1.6', marginBottom: '12px' },
  noteHomework: {
    backgroundColor: '#e0f2fe',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#0369a1',
  },

  // Questionnaires
  questionnaireList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  questionnaireCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  questionnaireTitle: { fontWeight: '500', color: '#334155' },
  fillBtn: {
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  typeformContainer: { height: '500px', borderRadius: '8px', overflow: 'hidden' },
  typeformIframe: { width: '100%', height: '100%', border: 'none' },

  // Reports
  reportsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reportCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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

  // Calendly
  calendlyContainer: { height: '600px', borderRadius: '8px', overflow: 'hidden' },
  calendlyIframe: { width: '100%', height: '100%', border: 'none' },

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
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#64748b',
  },
  emptyText: { color: '#64748b', fontStyle: 'italic' },

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
