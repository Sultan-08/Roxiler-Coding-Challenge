import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function Login({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      if (res.data.user.role === 'SYSTEM_ADMIN') navigate('/admin');
      else if (res.data.user.role === 'STORE_OWNER') navigate('/owner');
      else navigate('/user');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Beige and Grey Palette
  const bgCard = darkMode ? '#22201d' : '#ffffff';
  const textMain = darkMode ? '#f4efe6' : '#221f1c';
  const textMuted = darkMode ? '#9e978c' : '#756f66';
  const borderCol = darkMode ? '#38352f' : '#e2dcd2';
  const inputBg = darkMode ? '#1a1917' : '#fbf9f6';
  const inputBorder = darkMode ? '#3d3932' : '#dcd4c7';
  const primaryBtnBg = darkMode ? '#d5c7b3' : '#2c2825';
  const primaryBtnText = darkMode ? '#1c1a17' : '#faf8f4';
  const linkCol = darkMode ? '#d5c7b3' : '#453c30';

  return (
    <div style={{
      maxWidth: '430px',
      margin: '60px auto',
      padding: '36px 32px',
      backgroundColor: bgCard,
      borderRadius: '16px',
      border: `1px solid ${borderCol}`,
      boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 25px -4px rgba(45,38,30,0.08)',
      color: textMain,
      transition: 'all 0.25s ease'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: darkMode ? '#2d2a25' : '#f1ede5',
          border: `1px solid ${borderCol}`,
          fontSize: '20px',
          marginBottom: '12px'
        }}>
          🔑
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: textMain, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Welcome Back
        </h2>
        <p style={{ color: textMuted, fontSize: '13px' }}>
          Sign in to access your Store Rating Portal dashboard
        </p>
      </div>

      {error && (
        <div style={{
          color: darkMode ? '#fca5a5' : '#a82e22',
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: '500',
          background: darkMode ? '#321d1b' : '#faedeb',
          border: `1px solid ${darkMode ? '#542823' : '#f0cdc9'}`,
          padding: '11px 14px',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: textMuted }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="e.g. alex.admin@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '9px',
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: textMain,
              outline: 'none',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = darkMode ? '#d5c7b3' : '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = inputBorder}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: textMuted }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '9px',
              border: `1px solid ${inputBorder}`,
              background: inputBg,
              color: textMain,
              outline: 'none',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = darkMode ? '#d5c7b3' : '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = inputBorder}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: primaryBtnBg,
            color: primaryBtnText,
            border: 'none',
            borderRadius: '9px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '14.5px',
            marginTop: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s, background-color 0.2s'
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '22px', color: textMuted, fontSize: '13.5px' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: linkCol, fontWeight: '700', textDecoration: 'underline' }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
