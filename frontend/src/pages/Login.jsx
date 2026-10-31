import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function Login() {
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

  return (
    <div style={{
      maxWidth: '430px',
      margin: '60px auto',
      padding: '36px 32px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2dcd2',
      boxShadow: '0 10px 25px -4px rgba(45,38,30,0.08)',
      color: '#221f1c',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#221f1c', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Welcome Back
        </h2>
        <p style={{ color: '#756f66', fontSize: '13px' }}>
          Sign in to access your Store Rating Portal dashboard
        </p>
      </div>

      {error && (
        <div style={{
          color: '#a82e22',
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: '500',
          background: '#faedeb',
          border: '1px solid #f0cdc9',
          padding: '11px 14px',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#756f66' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '9px',
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '6px', color: '#756f66' }}>
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
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '14px',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2c2825',
            color: '#faf8f4',
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

      <p style={{ textAlign: 'center', marginTop: '22px', color: '#756f66', fontSize: '13.5px' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#453c30', fontWeight: '700', textDecoration: 'underline' }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
