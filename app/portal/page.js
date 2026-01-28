'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

export default function PortalDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('overzicht');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [progressData, setProgressData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Badge counts
  const [unreadInsights, setUnreadInsights] = useState(0);
  const [newReports, setNewReports] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Load user and data
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
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
    setLoading(false);
  }

  async function loadAllData() {
    // Progress Data
    const { data: progress } = await supabase
      .from('progress_data')
      .select('*')
      .eq('patient_id', user.id)
      .order('date', { ascending: true })
      .limit(12);
    setProgressData(progress || []);

    // AI Insights
    const { data: insightData } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('patient_id', user.id)
      .order('generated_at', { ascending: false });
    setInsights(insightData || []);
    setUnreadInsights(insightData?.filter(i => !i.is_read).length || 0);

    // Session Notes
    const { data: noteData } = await supabase
      .from('session_notes')
      .select('*')
      .eq('patient_id', user.id)
      .eq('is_visible', true)
      .order('session_date', { ascending: false });
    setNotes(noteData || []);

    // Reports
    const { data: reportData } = await supabase
      .from('reports')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false });
    setReports(reportData || []);
    setNewReports(reportData?.filter(r => r.is_new).length || 0);

    // Messages
    const { data: msgData } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    setMessages(msgData || []);
    setUnreadMessages(msgData?.filter(m => !m.is_read && m.receiver_id === user.id).length || 0);
  }

  function subscribeToMessages() {
    const channel = supabase
      .channel('messages-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new.receiver_id === user.id || payload.new.sender_id === user.id) {
            setMessages(prev => [...prev, payload.new]);
            if (payload.new.receiver_id === user.id) {
              setUnreadMessages(prev => prev + 1);
            }
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }

  const menuItems = [
    { id: 'overzicht', label: 'Overzicht', icon: '🏠' },
    { id: 'voortgang', label: 'Mijn Voortgang', icon: '📈' },
    { id: 'inzichten', label: 'AI Inzichten', icon: '🤖', badge: unreadInsights },
    { id: 'notities', label: 'Sessie Notities', icon: '📝' },
    { id: 'vragenlijsten', label: 'Vragenlijsten', icon: '📋' },
    { id: 'rapporten', label: 'Rapporten', icon: '📄', badge: newReports },
    { id: 'afspraken', label: 'Afspraken', icon: '📅' },
    { id: 'berichten', label: 'Berichten', icon: '💬', badge: unreadMessages },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginPrompt />;
  }

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
              <span style={styles.navLabel}>{item.label}</span>
              {item.badge > 0 && <span style={styles.badge}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{profile?.full_name || 'Gebruiker'}</span>
            <button 
              onClick={() => supabase.auth.signOut()}
              style={styles.logoutBtn}
            >
              Uitloggen
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {activeSection === 'overzicht' && (
          <OverzichtSection 
            profile={profile}
            progressData={progressData}
            insights={insights}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'voortgang' && (
          <VoortgangSection progressData={progressData} />
        )}
        {activeSection === 'inzichten' && (
          <InzichtenSection 
            insights={insights}
            setInsights={setInsights}
            setUnreadInsights={setUnreadInsights}
          />
        )}
        {activeSection === 'notities' && (
          <NotitiesSection notes={notes} />
        )}
        {activeSection === 'vragenlijsten' && (
          <VragenlijstenSection />
        )}
        {activeSection === 'rapporten' && (
          <RapportenSection 
            reports={reports}
            setReports={setReports}
            setNewReports={setNewReports}
          />
        )}
        {activeSection === 'afspraken' && (
          <AfsprakenSection />
        )}
        {activeSection === 'berichten' && (
          <BerichtenSection 
            messages={messages}
            setMessages={setMessages}
            userId={user.id}
            setUnreadMessages={setUnreadMessages}
          />
        )}
      </main>
    </div>
  );
}

// ============================================
// LOADING & LOGIN COMPONENTS
// ============================================

function LoadingScreen() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p>Laden...</p>
    </div>
  );
}

function LoginPrompt() {
  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <span style={{ fontSize: '48px' }}>🌿</span>
        <h1>Dynamic Parenting Portal</h1>
        <p>Log in om toegang te krijgen tot je persoonlijke dashboard.</p>
        <a href="/login" style={styles.loginButton}>Inloggen</a>
      </div>
    </div>
  );
}

// ============================================
// OVERZICHT SECTION
// ============================================

function OverzichtSection({ profile, progressData, insights, setActiveSection }) {
  const latest = progressData[progressData.length - 1];
  const previous = progressData[progressData.length - 2];

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>
        Welkom terug{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
      </h1>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard 
          icon="😌" 
          label="Stress" 
          value={latest?.stress_level}
          prev={previous?.stress_level}
          inverse
        />
        <StatCard 
          icon="⚡" 
          label="Energie" 
          value={latest?.energy_level}
          prev={previous?.energy_level}
        />
        <StatCard 
          icon="🌟" 
          label="Stemming" 
          value={latest?.mood_level}
          prev={previous?.mood_level}
        />
      </div>

      {/* Quick Actions */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Snelle acties</h3>
        <div style={styles.actionBtns}>
          <button style={styles.actionBtn} onClick={() => setActiveSection('vragenlijsten')}>
            📋 Vragenlijst invullen
          </button>
          <button style={styles.actionBtn} onClick={() => setActiveSection('afspraken')}>
            📅 Afspraak plannen
          </button>
          <button style={styles.actionBtn} onClick={() => setActiveSection('berichten')}>
            💬 Bericht sturen
          </button>
        </div>
      </div>

      {/* Mini Chart */}
      {progressData.length > 2 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Je voortgang</h3>
          <ProgressChart data={progressData.slice(-6)} />
        </div>
      )}

      {/* Latest Insight */}
      {insights[0] && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Laatste inzicht</h3>
          <div style={styles.insightPreview}>
            <span style={{ fontSize: '32px' }}>{insights[0].icon}</span>
            <div>
              <strong>{insights[0].title}</strong>
              <p style={{ color: '#6b7280', margin: '4px 0 0' }}>{insights[0].content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, prev, inverse = false }) {
  const change = value && prev ? value - prev : null;
  const isGood = inverse ? change < 0 : change > 0;

  return (
    <div style={styles.statCard}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <span style={styles.statValue}>{value || '-'}/10</span>
      <span style={styles.statLabel}>{label}</span>
      {change !== null && change !== 0 && (
        <span style={{ 
          fontSize: '12px', 
          fontWeight: '600',
          color: isGood ? '#22c55e' : '#ef4444' 
        }}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}
        </span>
      )}
    </div>
  );
}

// ============================================
// VOORTGANG SECTION
// ============================================

function VoortgangSection({ progressData }) {
  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📈 Mijn Voortgang</h1>
      <p style={styles.pageDesc}>Bekijk je stress, energie en stemming over tijd.</p>

      {progressData.length > 0 ? (
        <>
          <div style={styles.card}>
            <ProgressChart data={progressData} />
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Geschiedenis</h3>
            {progressData.slice().reverse().map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <span style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString('nl-NL', {
                    weekday: 'short', day: 'numeric', month: 'short'
                  })}
                </span>
                <div style={styles.historyValues}>
                  <span>😌 {item.stress_level}</span>
                  <span>⚡ {item.energy_level}</span>
                  <span>🌟 {item.mood_level}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState icon="📊" text="Nog geen voortgangsdata. Vul eerst een vragenlijst in." />
      )}
    </div>
  );
}

function ProgressChart({ data }) {
  const height = 120;
  const width = data.length * 70;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={width} height={height + 30} style={{ minWidth: '100%' }}>
        {/* Grid */}
        {[0, 50, 100].map(y => (
          <line key={y} x1="20" y1={height - y/100*height} x2={width} y2={height - y/100*height}
            stroke="#e5e7eb" strokeWidth="1" />
        ))}
        
        {/* Lines */}
        {['stress_level', 'energy_level', 'mood_level'].map((key, lineIdx) => {
          const colors = ['#ef4444', '#eab308', '#22c55e'];
          return (
            <polyline key={key} fill="none" stroke={colors[lineIdx]} strokeWidth="2"
              points={data.map((d, i) => 
                `${i * 70 + 50},${height - (d[key] / 10 * height)}`
              ).join(' ')} />
          );
        })}

        {/* X Labels */}
        {data.map((d, i) => (
          <text key={i} x={i * 70 + 50} y={height + 20} textAnchor="middle"
            fontSize="10" fill="#6b7280">
            {new Date(d.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
          </text>
        ))}
      </svg>
      
      <div style={styles.legend}>
        <span><span style={{ color: '#ef4444' }}>●</span> Stress</span>
        <span><span style={{ color: '#eab308' }}>●</span> Energie</span>
        <span><span style={{ color: '#22c55e' }}>●</span> Stemming</span>
      </div>
    </div>
  );
}

// ============================================
// AI INZICHTEN SECTION
// ============================================

function InzichtenSection({ insights, setInsights, setUnreadInsights }) {
  async function markAsRead(id) {
    await supabase.from('ai_insights').update({ is_read: true }).eq('id', id);
    setInsights(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
    setUnreadInsights(prev => Math.max(0, prev - 1));
  }

  const typeStyles = {
    positive: { bg: '#dcfce7', border: '#22c55e' },
    pattern: { bg: '#dbeafe', border: '#3b82f6' },
    tip: { bg: '#fef3c7', border: '#eab308' },
    warning: { bg: '#fee2e2', border: '#ef4444' },
  };

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>🤖 AI Inzichten</h1>
      <p style={styles.pageDesc}>Persoonlijke inzichten gebaseerd op je data.</p>

      {insights.length > 0 ? (
        <div style={styles.insightsList}>
          {insights.map(insight => {
            const style = typeStyles[insight.insight_type] || typeStyles.tip;
            return (
              <div 
                key={insight.id}
                onClick={() => !insight.is_read && markAsRead(insight.id)}
                style={{
                  ...styles.insightCard,
                  backgroundColor: style.bg,
                  borderLeft: `4px solid ${style.border}`,
                  opacity: insight.is_read ? 0.7 : 1,
                  cursor: insight.is_read ? 'default' : 'pointer'
                }}
              >
                <div style={styles.insightHeader}>
                  <span style={{ fontSize: '24px' }}>{insight.icon}</span>
                  <span style={styles.insightTitle}>{insight.title}</span>
                  {!insight.is_read && <span style={styles.newBadge}>Nieuw</span>}
                </div>
                <p style={styles.insightContent}>{insight.content}</p>
                <span style={styles.insightDate}>
                  {new Date(insight.generated_at).toLocaleDateString('nl-NL')}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="💡" text="Nog geen inzichten. Deze verschijnen na het invullen van vragenlijsten." />
      )}
    </div>
  );
}

// ============================================
// SESSIE NOTITIES SECTION
// ============================================

function NotitiesSection({ notes }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📝 Sessie Notities</h1>
      <p style={styles.pageDesc}>Samenvattingen van je therapeut na elke sessie.</p>

      {notes.length > 0 ? (
        <div style={styles.notesList}>
          {notes.map(note => (
            <div key={note.id} style={styles.noteCard}>
              <div 
                style={styles.noteHeader}
                onClick={() => setExpanded(expanded === note.id ? null : note.id)}
              >
                <div>
                  <h3 style={styles.noteTitle}>{note.title}</h3>
                  <span style={styles.noteDate}>
                    {new Date(note.session_date).toLocaleDateString('nl-NL', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })}
                  </span>
                </div>
                <span>{expanded === note.id ? '▼' : '▶'}</span>
              </div>

              {expanded === note.id && (
                <div style={styles.noteBody}>
                  <p>{note.summary}</p>
                  
                  {note.key_points?.length > 0 && (
                    <div style={styles.noteSection}>
                      <strong>Belangrijke punten:</strong>
                      <ul>
                        {note.key_points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {note.homework && (
                    <div style={styles.noteSection}>
                      <strong>📚 Huiswerk:</strong>
                      <p>{note.homework}</p>
                    </div>
                  )}

                  {note.next_focus && (
                    <div style={styles.noteSection}>
                      <strong>🎯 Volgende sessie:</strong>
                      <p>{note.next_focus}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📝" text="Nog geen sessie notities beschikbaar." />
      )}
    </div>
  );
}

// ============================================
// VRAGENLIJSTEN SECTION (Typeform)
// ============================================

function VragenlijstenSection() {
  // Configure your Typeform IDs here
  const typeforms = [
    {
      id: 'weekly',
      title: 'Wekelijkse Check-in',
      desc: 'Korte vragenlijst over je week (5 min)',
      typeformId: 'bM30pflI', // Vervang met echte Typeform ID
    },
    {
      id: 'intake',
      title: 'Intake Vragenlijst',
      desc: 'Uitgebreide vragenlijst voor nieuwe cliënten (15 min)',
      typeformId: 'bM30pflI_2', // Vervang met echte Typeform ID
    },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📋 Vragenlijsten</h1>
      <p style={styles.pageDesc}>Vul vragenlijsten in om je voortgang te meten.</p>

      {selected ? (
        <div style={styles.typeformContainer}>
          <button style={styles.backBtn} onClick={() => setSelected(null)}>
            ← Terug naar overzicht
          </button>
          <iframe
            src={`https://form.typeform.com/to/${selected.typeformId}`}
            style={styles.typeformFrame}
            frameBorder="0"
          />
        </div>
      ) : (
        <div style={styles.formsList}>
          {typeforms.map(form => (
            <div key={form.id} style={styles.formCard}>
              <div>
                <h3 style={styles.formTitle}>{form.title}</h3>
                <p style={styles.formDesc}>{form.desc}</p>
              </div>
              <button style={styles.formBtn} onClick={() => setSelected(form)}>
                Invullen →
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={styles.typeformNote}>
        💡 Je antwoorden worden automatisch verwerkt en verschijnen in je voortgang.
      </div>
    </div>
  );
}

// ============================================
// RAPPORTEN SECTION
// ============================================

function RapportenSection({ reports, setReports, setNewReports }) {
  async function markViewed(id) {
    await supabase.from('reports').update({ is_new: false }).eq('id', id);
    setReports(prev => prev.map(r => r.id === id ? { ...r, is_new: false } : r));
    setNewReports(prev => Math.max(0, prev - 1));
  }

  const fileIcons = { pdf: '📕', docx: '📘', default: '📄' };

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📄 Rapporten</h1>
      <p style={styles.pageDesc}>Documenten en rapporten van je therapeut.</p>

      {reports.length > 0 ? (
        <div style={styles.reportsList}>
          {reports.map(report => (
            <div key={report.id} style={styles.reportCard}>
              <span style={{ fontSize: '32px' }}>
                {fileIcons[report.file_type] || fileIcons.default}
              </span>
              <div style={styles.reportInfo}>
                <div style={styles.reportTitleRow}>
                  <h3 style={styles.reportTitle}>{report.title}</h3>
                  {report.is_new && <span style={styles.newBadge}>Nieuw</span>}
                </div>
                {report.description && <p style={styles.reportDesc}>{report.description}</p>}
                <span style={styles.reportMeta}>
                  {report.category} • {new Date(report.created_at).toLocaleDateString('nl-NL')}
                </span>
              </div>
              <a 
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.downloadBtn}
                onClick={() => report.is_new && markViewed(report.id)}
              >
                Download
              </a>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="📄" text="Nog geen rapporten beschikbaar." />
      )}
    </div>
  );
}

// ============================================
// AFSPRAKEN SECTION (Calendly)
// ============================================

function AfsprakenSection() {
  // Configure your Calendly URL here
  const calendlyUrl = "https://calendly.com/walterzantinge/30min?embed_domain=dynamicparenting.vercel.app&embed_type=Inline";

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>📅 Afspraken</h1>
      <p style={styles.pageDesc}>Plan een nieuwe sessie of bekijk je afspraken.</p>

      <div style={styles.appointmentCard}>
        <div>
          <h3>Volgende afspraak</h3>
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Geen geplande afspraak</p>
        </div>
        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" style={styles.calendlyBtn}>
          📅 Plan nieuwe afspraak
        </a>
      </div>

      <div style={styles.card}>
        <iframe
          src={`${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1`}
          style={styles.calendlyFrame}
          frameBorder="0"
        />
      </div>
    </div>
  );
}

// ============================================
// BERICHTEN SECTION
// ============================================

function BerichtenSection({ messages, setMessages, userId, setUnreadMessages }) {
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read on open
  useEffect(() => {
    markAllRead();
  }, []);

  async function markAllRead() {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);
    setUnreadMessages(0);
  }

  async function sendMessage() {
    if (!newMsg.trim() || sending) return;

    // Get therapist ID (first message's other party)
    const therapistId = messages.find(m => m.sender_id !== userId)?.sender_id 
      || messages.find(m => m.receiver_id !== userId)?.receiver_id;

    if (!therapistId) {
      alert('Geen therapeut gevonden. Neem contact op via email.');
      return;
    }

    setSending(true);
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: userId,
        receiver_id: therapistId,
        content: newMsg.trim()
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data]);
      setNewMsg('');
    }
    setSending(false);
  }

  return (
    <div style={styles.section}>
      <h1 style={styles.pageTitle}>💬 Berichten</h1>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.length > 0 ? (
            messages.map(msg => (
              <div 
                key={msg.id}
                style={{
                  ...styles.message,
                  ...(msg.sender_id === userId ? styles.msgSent : styles.msgReceived)
                }}
              >
                <p style={styles.msgText}>{msg.content}</p>
                <span style={styles.msgTime}>
                  {new Date(msg.created_at).toLocaleTimeString('nl-NL', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            ))
          ) : (
            <div style={styles.emptyChat}>
              <p>Nog geen berichten. Start een gesprek!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Typ je bericht..."
            style={styles.textarea}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
          />
          <button 
            onClick={sendMessage}
            disabled={sending || !newMsg.trim()}
            style={styles.sendBtn}
          >
            {sending ? '...' : 'Verstuur'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

function EmptyState({ icon, text }) {
  return (
    <div style={styles.emptyState}>
      <span style={{ fontSize: '48px' }}>{icon}</span>
      <p>{text}</p>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '"DM Sans", -apple-system, sans-serif',
  },

  // Sidebar
  sidebar: {
    width: '260px',
    backgroundColor: '#1e293b',
    color: 'white',
    position: 'fixed',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    padding: '24px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: { fontSize: '28px' },
  logoText: { fontSize: '16px', fontWeight: '600', color: '#93C5FD' },
  nav: {
    flex: 1,
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  navItemActive: {
    backgroundColor: 'rgba(147, 197, 253, 0.2)',
    color: 'white',
  },
  navIcon: { fontSize: '18px', width: '24px' },
  navLabel: { flex: 1 },
  badge: {
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },
  userSection: {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3D5A80',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  userInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  userName: { fontSize: '14px', fontWeight: '500' },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
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
    minHeight: '100vh',
  },
  section: { maxWidth: '900px' },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  pageDesc: {
    color: '#64748b',
    marginBottom: '32px',
  },

  // Cards
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
    marginTop: 0,
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1e293b' },
  statLabel: { fontSize: '14px', color: '#6b7280' },

  // Actions
  actionBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  actionBtn: {
    padding: '12px 20px',
    backgroundColor: '#3D5A80',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  // Chart
  legend: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '16px',
    fontSize: '13px',
    color: '#6b7280',
  },

  // History
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  historyDate: { fontWeight: '500', color: '#374151' },
  historyValues: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' },

  // Insights
  insightPreview: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  insightsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  insightCard: { padding: '20px', borderRadius: '12px', transition: 'all 0.2s' },
  insightHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  insightTitle: { fontWeight: '600', color: '#1e293b', flex: 1 },
  insightContent: { color: '#4b5563', fontSize: '14px', margin: 0, lineHeight: 1.6 },
  insightDate: { fontSize: '12px', color: '#9ca3af', marginTop: '12px', display: 'block' },
  newBadge: {
    backgroundColor: '#22c55e',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
  },

  // Notes
  notesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  noteHeader: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  noteTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
  noteDate: { fontSize: '13px', color: '#6b7280' },
  noteBody: { padding: '0 20px 20px', borderTop: '1px solid #e5e7eb' },
  noteSection: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },

  // Forms
  formsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  formCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px' },
  formDesc: { fontSize: '14px', color: '#6b7280', margin: 0 },
  formBtn: {
    padding: '10px 20px',
    backgroundColor: '#3D5A80',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  typeformContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  backBtn: {
    padding: '16px 20px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#3D5A80',
    fontWeight: '500',
  },
  typeformFrame: { width: '100%', height: '600px', border: 'none' },
  typeformNote: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#92400e',
  },

  // Reports
  reportsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reportCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  reportInfo: { flex: 1 },
  reportTitleRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  reportTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
  reportDesc: { fontSize: '14px', color: '#6b7280', margin: '4px 0 0' },
  reportMeta: { fontSize: '12px', color: '#9ca3af' },
  downloadBtn: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },

  // Appointments
  appointmentCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendlyBtn: {
    padding: '14px 28px',
    backgroundColor: '#3D5A80',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    textDecoration: 'none',
  },
  calendlyFrame: { width: '100%', height: '650px', border: 'none' },

  // Chat
  chatContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
  },
  messagesArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '12px',
  },
  msgSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#3D5A80',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  msgReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    color: '#1e293b',
    borderBottomLeftRadius: '4px',
  },
  msgText: { margin: 0, fontSize: '14px', lineHeight: 1.5 },
  msgTime: { fontSize: '11px', opacity: 0.7, marginTop: '4px', display: 'block' },
  emptyChat: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
  },
  inputArea: {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '12px',
  },
  textarea: {
    flex: 1,
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    resize: 'none',
    fontSize: '14px',
    minHeight: '44px',
    maxHeight: '120px',
    fontFamily: 'inherit',
  },
  sendBtn: {
    padding: '12px 24px',
    backgroundColor: '#3D5A80',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  // Empty state
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #3D5A80',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Login
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc',
  },
  loginBox: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '400px',
  },
  loginButton: {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#3D5A80',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '16px',
  },
};

// Add keyframes for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}
