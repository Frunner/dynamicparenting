'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TherapistPortal() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [patients, setPatients] = useState([])
  const [allResponses, setAllResponses] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientResponses, setPatientResponses] = useState([])
  const [selectedResponse, setSelectedResponse] = useState(null)

  useEffect(() => { checkUser() }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData?.role !== 'therapist') { router.push('/portaal'); return }
      setProfile(profileData)
      await loadData()
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    const { data: patientsData } = await supabase.from('profiles').select('*').eq('role', 'patient').order('created_at', { ascending: false })
    setPatients(patientsData || [])

    const { data: responsesData } = await supabase.from('patient_questionnaires').select('*, profiles(*), questionnaires(*)').order('created_at', { ascending: false })
    setAllResponses(responsesData || [])

    const { data: apptData } = await supabase.from('appointments').select('*, profiles(*)').gte('date_time', new Date().toISOString()).order('date_time', { ascending: true })
    setAppointments(apptData || [])
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  const viewPatient = async (patient) => {
    setSelectedPatient(patient)
    const { data } = await supabase.from('patient_questionnaires').select('*, questionnaires(*)').eq('patient_id', patient.id).order('created_at', { ascending: false })
    setPatientResponses(data || [])
    setActiveTab('patient-detail')
  }

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#F0F8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>Laden...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F8F0' }}>
      <header style={{ backgroundColor: '#2E7D32', color: 'white', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'var(--font-playfair)' }}>Therapeut Dashboard</h1>
            <p style={{ color: '#A5D6A7', fontSize: '0.9rem' }}>Welkom, {profile?.full_name || 'Therapeut'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/" style={{ color: '#A5D6A7', fontSize: '0.9rem' }}>Naar website</Link>
            <button onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Uitloggen</button>
          </div>
        </div>
      </header>

      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', padding: '0 2rem' }}>
          {[{ id: 'dashboard', label: '📊 Overzicht' }, { id: 'patients', label: '👥 Patiënten' }, { id: 'responses', label: '📋 Antwoorden' }, { id: 'appointments', label: '📅 Afspraken' }].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedPatient(null); setSelectedResponse(null) }} style={{ padding: '1rem 0', borderBottom: activeTab === tab.id ? '2px solid #2E7D32' : '2px solid transparent', color: activeTab === tab.id ? '#2E7D32' : '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontWeight: activeTab === tab.id ? '500' : '400' }}>{tab.label}</button>
          ))}
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Overzicht</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {[{ icon: '👥', value: patients.length, label: 'Patiënten' }, { icon: '📋', value: allResponses.length, label: 'Vragenlijsten' }, { icon: '🆕', value: allResponses.filter(r => new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, label: 'Deze week' }, { icon: '📅', value: appointments.length, label: 'Afspraken' }].map((stat, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2E7D32' }}>{stat.value}</div>
                  <div style={{ color: '#6B7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: '600', color: '#2E7D32' }}>Recente inzendingen</h3>
              </div>
              {allResponses.slice(0, 5).map(response => (
                <div key={response.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#333' }}>{response.profiles?.full_name || 'Onbekend'}</div>
                    <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{response.questionnaires?.title}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>{new Date(response.created_at).toLocaleDateString('nl-NL')}</span>
                    <button onClick={() => setSelectedResponse(response)} style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>Bekijken →</button>
                  </div>
                </div>
              ))}
              {allResponses.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Nog geen inzendingen</div>}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Patiënten ({patients.length})</h2>
            {patients.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Nog geen patiënten</h3>
                <p style={{ color: '#6B7280' }}>Patiënten verschijnen hier na registratie.</p>
              </div>
            ) : (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Naam</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Telefoon</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <tr key={patient.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{patient.full_name || 'Geen naam'}</td>
                        <td style={{ padding: '1rem', color: '#6B7280' }}>{patient.email}</td>
                        <td style={{ padding: '1rem', color: '#6B7280' }}>{patient.phone || '-'}</td>
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => viewPatient(patient)} style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>Bekijken →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'patient-detail' && selectedPatient && (
          <div>
            <button onClick={() => { setActiveTab('patients'); setSelectedPatient(null) }} style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem' }}>← Terug naar patiënten</button>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#2E7D32', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>{selectedPatient.full_name?.charAt(0) || '?'}</div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32', fontFamily: 'var(--font-playfair)' }}>{selectedPatient.full_name || 'Geen naam'}</h2>
                <p style={{ color: '#6B7280' }}>{selectedPatient.email}</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <h3 style={{ fontWeight: '600', color: '#2E7D32' }}>Ingevulde vragenlijsten ({patientResponses.length})</h3>
              </div>
              {patientResponses.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>Nog geen vragenlijsten ingevuld</div>
              ) : patientResponses.map(response => (
                <div key={response.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{response.questionnaires?.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>{new Date(response.created_at).toLocaleDateString('nl-NL')}</div>
                  </div>
                  <button onClick={() => setSelectedResponse(response)} style={{ backgroundColor: '#2E7D32', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>Bekijken</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Alle antwoorden ({allResponses.length})</h2>
            {allResponses.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Nog geen antwoorden</h3>
              </div>
            ) : (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#F9FAFB' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Patiënt</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Vragenlijst</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Datum</th>
                      <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.9rem', fontWeight: '500', color: '#6B7280' }}>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allResponses.map(response => (
                      <tr key={response.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{response.profiles?.full_name || 'Onbekend'}</td>
                        <td style={{ padding: '1rem', color: '#6B7280' }}>{response.questionnaires?.title}</td>
                        <td style={{ padding: '1rem', color: '#6B7280' }}>{new Date(response.created_at).toLocaleDateString('nl-NL')}</td>
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => setSelectedResponse(response)} style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>Bekijken →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2E7D32', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)' }}>Afspraken ({appointments.length})</h2>
            {appointments.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Geen komende afspraken</h3>
              </div>
            ) : appointments.map(appt => (
              <div key={appt.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#2E7D32', color: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{new Date(appt.date_time).getDate()}</div>
                  <div style={{ fontSize: '0.8rem' }}>{new Date(appt.date_time).toLocaleDateString('nl-NL', { month: 'short' })}</div>
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', color: '#2E7D32' }}>{appt.profiles?.full_name || 'Onbekend'}</h4>
                  <p style={{ color: '#6B7280' }}>{appt.type || 'Sessie'} • {new Date(appt.date_time).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedResponse && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2E7D32', fontFamily: 'var(--font-playfair)' }}>{selectedResponse.questionnaires?.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{selectedResponse.profiles?.full_name} • {new Date(selectedResponse.created_at).toLocaleDateString('nl-NL')}</p>
              </div>
              <button onClick={() => setSelectedResponse(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#9CA3AF', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {selectedResponse.questionnaires?.questions?.map((q, i) => (
                <div key={q.id} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '0.3rem' }}>Vraag {i + 1}</div>
                  <div style={{ fontWeight: '500', color: '#333', marginBottom: '0.5rem' }}>{q.question}</div>
                  <div style={{ backgroundColor: '#F0F8F0', padding: '0.75rem', borderRadius: '8px', color: '#2E7D32' }}>
                    {selectedResponse.answers?.[q.id] || <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Niet beantwoord</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
              <button onClick={() => setSelectedResponse(null)} style={{ width: '100%', backgroundColor: '#2E7D32', color: 'white', padding: '0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Sluiten</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
