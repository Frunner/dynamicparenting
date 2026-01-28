'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Get user profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Redirect based on role
        if (profile?.role === 'therapist') {
          window.location.href = '/therapeut';
        } else {
          window.location.href = '/portal';
        }
      }
    } catch (err) {
      setError(err.message || 'Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🌿</span>
          <h1 style={styles.logoText}>Dynamic Parenting</h1>
          <p style={styles.tagline}>Welkom terug</p>
        </div>

        {/* Role Info */}
        <div style={styles.roleInfo}>
          <div style={styles.roleCard}>
            <span style={styles.roleIcon}>👤</span>
            <div>
              <strong>Patiënt?</strong>
              <p style={styles.roleDesc}>Log in om je voortgang te bekijken</p>
            </div>
          </div>
          <div style={styles.roleCard}>
            <span style={styles.roleIcon}>👩‍⚕️</span>
            <div>
              <strong>Therapeut?</strong>
              <p style={styles.roleDesc}>Log in om je patiënten te beheren</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={styles.formTitle}>Inloggen</h2>
          
          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="naam@voorbeeld.nl"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Wachtwoord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>
        </form>

        {/* Register Link */}
        <p style={styles.registerText}>
          Nog geen account?{' '}
          <Link href="/registreren" style={styles.registerLink}>
            Registreren
          </Link>
        </p>

        {/* Back to Website */}
        <Link href="/" style={styles.backLink}>
          ← Terug naar de website
        </Link>
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>ℹ️ Hoe werkt het?</h3>
        <ul style={styles.infoList}>
          <li><strong>Patiënten</strong> worden automatisch naar het patiënt portaal geleid</li>
          <li><strong>Therapeuten</strong> worden automatisch naar het therapeut portaal geleid</li>
          <li>Je rol wordt bepaald door je account instellingen</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#faf8f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logoIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e3a5f',
    margin: 0,
  },
  tagline: {
    color: '#64748b',
    fontSize: '15px',
    marginTop: '4px',
  },
  roleInfo: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  roleCard: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    fontSize: '13px',
  },
  roleIcon: {
    fontSize: '24px',
  },
  roleDesc: {
    margin: '4px 0 0 0',
    color: '#64748b',
    fontSize: '12px',
  },
  form: {
    marginBottom: '20px',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e3a5f',
    marginBottom: '20px',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    border: '1px solid #fecaca',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.2s',
  },
  registerText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '16px',
  },
  registerLink: {
    color: '#1e3a5f',
    fontWeight: '600',
    textDecoration: 'none',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    textDecoration: 'none',
  },
  infoBox: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#e0f2fe',
    borderRadius: '12px',
    maxWidth: '440px',
    width: '100%',
  },
  infoTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: '12px',
    marginTop: 0,
  },
  infoList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#0c4a6e',
    fontSize: '13px',
    lineHeight: '1.8',
  },
};
