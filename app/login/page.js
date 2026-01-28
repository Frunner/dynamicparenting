'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profile?.role === 'therapist') {
        router.push('/therapeut')
      } else {
        router.push('/portaal')
      }

    } catch (err) {
      setError(err.message || 'Er ging iets mis bij het inloggen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', fontFamily: 'var(--font-playfair)' }}>
            Dynamic Parenting
          </Link>
          <p style={{ color: '#5B7FA3', marginTop: '0.5rem' }}>Welkom terug</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-playfair)' }}>
            Inloggen
          </h1>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#3D5A80', marginBottom: '0.5rem' }}>
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8DDD1', borderRadius: '8px', fontSize: '1rem' }}
                placeholder="naam@voorbeeld.nl"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#3D5A80', marginBottom: '0.5rem' }}>
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8DDD1', borderRadius: '8px', fontSize: '1rem' }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#3D5A80', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px', fontWeight: '500', fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#5B7FA3' }}>
            Nog geen account?{' '}
            <Link href="/registreren" style={{ color: '#3D5A80', fontWeight: '500' }}>Registreren</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#5B7FA3' }}>← Terug naar de website</Link>
        </p>
      </div>
    </div>
  )
}
