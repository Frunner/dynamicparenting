'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegistrerenPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten')
      setLoading(false)
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName } }
      })

      if (authError) throw authError

      if (authData.user) {
        await supabase.from('profiles').update({ full_name: formData.fullName, phone: formData.phone }).eq('id', authData.user.id)
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>Check je e-mail</h1>
            <p style={{ color: '#5B7FA3', marginBottom: '1.5rem' }}>
              We hebben een bevestigingslink gestuurd naar <strong>{formData.email}</strong>. Klik op de link om je account te activeren.
            </p>
            <Link href="/login" style={{ display: 'inline-block', backgroundColor: '#3D5A80', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500' }}>
              Ga naar inloggen
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', fontFamily: 'var(--font-playfair)' }}>Dynamic Parenting</Link>
          <p style={{ color: '#5B7FA3', marginTop: '0.5rem' }}>Maak een account aan</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-playfair)' }}>Registreren</h1>

          {error && <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleRegister}>
            {[
              { name: 'fullName', label: 'Volledige naam *', type: 'text', placeholder: 'Jan Jansen' },
              { name: 'email', label: 'E-mailadres *', type: 'email', placeholder: 'naam@voorbeeld.nl' },
              { name: 'phone', label: 'Telefoonnummer', type: 'tel', placeholder: '06-12345678', required: false },
              { name: 'password', label: 'Wachtwoord *', type: 'password', placeholder: 'Minimaal 6 tekens' },
              { name: 'confirmPassword', label: 'Bevestig wachtwoord *', type: 'password', placeholder: 'Herhaal wachtwoord' },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#3D5A80', marginBottom: '0.5rem' }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required !== false}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8DDD1', borderRadius: '8px', fontSize: '1rem' }}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#3D5A80', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, marginTop: '0.5rem' }}>
              {loading ? 'Bezig...' : 'Account aanmaken'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#5B7FA3' }}>
            Al een account? <Link href="/login" style={{ color: '#3D5A80', fontWeight: '500' }}>Inloggen</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#5B7FA3' }}>← Terug naar de website</Link>
        </p>
      </div>
    </div>
  )
}
