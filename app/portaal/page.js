'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PatientPortal() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [questionnaires, setQuestionnaires] = useState([])
  const [myQuestionnaires, setMyQuestionnaires] = useState([])
  const [documents, setDocuments] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData?.role === 'therapist') { router.push('/therapeut'); return }
      setProfile(profileData)
      await loadData(user.id)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async (userId) => {
    const { data: questData } = await supabase.from('questionnaires').select('*').eq('is_active', true)
    setQuestionnaires(questData || [])

    const { data: myQuestData } = await supabase.from('patient_questionnaires').select('*, questionnaires(*)').eq('patient_id', userId)
    setMyQuestionnaires(myQuestData || [])

    const { data: docsData } = await supabase.from('documents').select('*').eq('patient_id', userId).order('created_at', { ascending: false })
    setDocuments(docsData || [])

    const { data: apptData } = await supabase.from('appointments').select('*').eq('patient_id', userId).gte('date_time', new Date().toISOString()).order('date_time', { ascending: true })
    setAppointments(apptData || [])
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  const submitQuestionnaire = async () => {
    if (!selectedQuestionnaire || !user) return
    setSubmitting(true)
    try {
      await supabase.from('patient_questionnaires').insert({
        patient_id: user.id,
        questionnaire_id: selectedQuestionnaire.id,
        answers: answers,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      await loadData(user.id)
      setSelectedQuestionnaire(null)
      setAnswers({})
    } catch (error) {
      alert('Er ging iets mis')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D5A80' }}>Laden...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8' }}>
      <header style={{ backgroundColor: '#3D5A80', color: 'white', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair)' }}>Mijn Portaal</h1>
            <p style={{ color: '#B8C9DB', fontSize: '0.9rem' }}>Welkom, {profile?.full_name || 'Patiënt'}</p>
          </div>
          <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Uitloggen</button>
        </div>
      </header>

      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', padding: '0 2rem' }}>
          {[{ id: 'dashboard', label: '🏠 Dashboard' }, { id: 'questionnaires', label: '📋 Vragenlijsten' }, { id: 'documents', label: '📄 Documenten' }, { id: 'appointments', label: '📅 Afspraken' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '1rem 0', borderBottom: activeTab === tab.id ? '2px solid #3D5A80' : '2px solid transparent', color: activeTab === tab.id ? '#3D5A80' : '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab.id ? '500' : '400' }}>{tab.label}</button>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[{ icon: '📋', value: myQuestionnaires.filter(q => q.status === 'completed').length, label: 'Vragenlijsten ingevuld' }, { icon: '📄', value: documents.length, label: 'Documenten' }, { icon: '📅', value: appointments.length, label: 'Komende afspraken' }].map((stat, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3D5A80' }}>{stat.value}</div>
                  <div style={{ color: '#6B7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', color: '#3D5A80', marginBottom: '1rem' }}>Snelle acties</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('questionnaires')} style={{ backgroundColor: '#3D5A80', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>📋 Vragenlijst invullen</button>
                <button onClick={() => setActiveTab('documents')} style={{ backgroundColor: '#F5EDE4', color: '#3D5A80', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>📄 Documenten bekijken</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questionnaires' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Vragenlijsten</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {questionnaires.map(quest => (
                <div key={quest.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{quest.icon || '📋'}</span>
                    <span style={{ backgroundColor: '#F5EDE4', color: '#3D5A80', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>{quest.duration || '10 min'}</span>
                  </div>
                  <h3 style={{ fontWeight: '600', color: '#3D5A80', marginBottom: '0.5rem' }}>{quest.title}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1rem' }}>{quest.description}</p>
                  <button onClick={() => { setSelectedQuestionnaire(quest); setAnswers({}) }} style={{ width: '100%', backgroundColor: '#3D5A80', color: 'white', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Invullen</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Documenten</h2>
            {documents.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem' }}>Nog geen documenten</h3>
                <p style={{ color: '#6B7280' }}>Je therapeut kan hier documenten voor je delen.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {documents.map(doc => (
                  <div key={doc.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                    <h4 style={{ fontWeight: '600', color: '#3D5A80', marginBottom: '0.5rem' }}>{doc.title}</h4>
                    <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{doc.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Afspraken</h2>
            {appointments.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem' }}>Geen komende afspraken</h3>
                <p style={{ color: '#6B7280', marginBottom: '1rem' }}>Neem contact op om een afspraak te plannen.</p>
                <Link href="/contact" style={{ display: 'inline-block', backgroundColor: '#3D5A80', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>Contact opnemen</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map(appt => (
                  <div key={appt.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#3D5A80', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{new Date(appt.date_time).getDate()}</div>
                      <div style={{ fontSize: '0.8rem' }}>{new Date(appt.date_time).toLocaleDateString('nl-NL', { month: 'short' })}</div>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '600', color: '#3D5A80' }}>{appt.type || 'Sessie'}</h4>
                      <p style={{ color: '#6B7280' }}>{new Date(appt.date_time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {selectedQuestionnaire && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#3D5A80', fontFamily: 'var(--font-playfair)' }}>{selectedQuestionnaire.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{selectedQuestionnaire.description}</p>
              </div>
              <button onClick={() => setSelectedQuestionnaire(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#9CA3AF', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {selectedQuestionnaire.questions?.map((q, i) => (
                <div key={q.id} style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: '500', color: '#3D5A80', marginBottom: '0.5rem' }}>{i + 1}. {q.question}</label>
                  {q.type === 'textarea' ? (
                    <textarea value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} rows={4} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', resize: 'none' }} />
                  ) : q.type === 'select' ? (
                    <select value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                      <option value="">Selecteer...</option>
                      {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : q.type === 'scale' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <button key={num} onClick={() => setAnswers({ ...answers, [q.id]: num })} style={{ width: '36px', height: '36px', borderRadius: '8px', border: answers[q.id] === num ? 'none' : '1px solid #E5E7EB', backgroundColor: answers[q.id] === num ? '#3D5A80' : 'white', color: answers[q.id] === num ? 'white' : '#333', cursor: 'pointer' }}>{num}</button>
                      ))}
                    </div>
                  ) : (
                    <input type="text" value={answers[q.id] || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedQuestionnaire(null)} style={{ padding: '0.75rem 1.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', background: 'white', cursor: 'pointer' }}>Annuleren</button>
              <button onClick={submitQuestionnaire} disabled={submitting} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3D5A80', color: 'white', borderRadius: '8px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1 }}>{submitting ? 'Versturen...' : 'Versturen'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
