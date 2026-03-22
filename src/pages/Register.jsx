import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>⬡ SignVault</div>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Start signing documents securely</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} type="text" placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone (optional)</label>
            <input style={styles.input} type="tel" placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #111118 100%)',
    padding: '20px',
  },
  card: {
    background: '#16161f', border: '1px solid #2a2a3a',
    borderRadius: '16px', padding: '48px 40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 0 60px rgba(0,212,255,0.05)',
  },
  logo: {
    fontSize: '22px', fontFamily: 'Syne, sans-serif',
    fontWeight: 800, color: '#00d4ff',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px', fontFamily: 'Syne, sans-serif',
    fontWeight: 700, color: '#f0f0f5', marginBottom: '8px',
  },
  subtitle: { fontSize: '14px', color: '#8888aa', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', color: '#8888aa', letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: {
    background: '#0a0a0f', border: '1px solid #2a2a3a',
    borderRadius: '8px', padding: '12px 16px',
    color: '#f0f0f5', fontSize: '14px',
  },
  btn: {
    background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
    border: 'none', borderRadius: '8px',
    padding: '14px', color: '#fff',
    fontSize: '15px', fontWeight: 700, marginTop: '8px',
  },
  btnDisabled: {
    background: '#2a2a3a', border: 'none',
    borderRadius: '8px', padding: '14px',
    color: '#8888aa', fontSize: '15px', marginTop: '8px',
  },
  footer: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#8888aa' },
  link: { color: '#00d4ff', fontWeight: 600 },
};