import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.name.length < 20 || formData.name.length > 60) {
      setMessage('Name must be between 20 and 60 characters.');
      setIsSuccess(false);
      return;
    }
    if (formData.address.length > 400) {
      setMessage('Address cannot exceed 400 characters.');
      setIsSuccess(false);
      return;
    }
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!pwdRegex.test(formData.password)) {
      setMessage('Password must be 8-16 chars, include 1 uppercase and 1 special character.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
      setIsSuccess(true);
      setMessage(res.data.message || 'Account registered successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '40px auto',
      padding: '36px 32px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2dcd2',
      boxShadow: '0 10px 25px -4px rgba(45,38,30,0.08)',
      color: '#221f1c',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#221f1c', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Create an Account
        </h2>
        <p style={{ color: '#756f66', fontSize: '13px' }}>
          Join Store Rating Application.
        </p>
      </div>

      {message && (
        <div style={{
          color: isSuccess ? '#2f592a' : '#a82e22',
          textAlign: 'center',
          marginBottom: '18px',
          fontWeight: '500',
          background: isSuccess ? '#edf5ec' : '#faedeb',
          border: `1px solid ${isSuccess ? '#c8e0c6' : '#f0cdc9'}`,
          padding: '11px 14px',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '5px', color: '#756f66' }}>
            Full Name <span style={{ fontSize: '11px', fontWeight: 'normal' }}>(20-60 characters)</span>
          </label>
          <input
            type="text"
            placeholder="Enter full name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: '8px',
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '13.5px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '5px', color: '#756f66' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter email address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: '8px',
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '13.5px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '5px', color: '#756f66' }}>
            Password <span style={{ fontSize: '11px', fontWeight: 'normal' }}>(8-16 chars, 1 Uppercase, 1 Special)</span>
          </label>
          <input
            type="password"
            placeholder="Enter password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: '8px',
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '13.5px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '5px', color: '#756f66' }}>
            Address <span style={{ fontSize: '11px', fontWeight: 'normal' }}>(Max 400 characters)</span>
          </label>
          <input
            type="text"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: '8px',
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '13.5px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2c2825'}
            onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '5px', color: '#756f66' }}>
            Account Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 13px',
              borderRadius: '8px',
              border: '1px solid #dcd4c7',
              background: '#fbf9f6',
              color: '#221f1c',
              outline: 'none',
              fontSize: '13.5px'
            }}
          >
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>
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
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '22px', color: '#756f66', fontSize: '13.5px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#453c30', fontWeight: '700', textDecoration: 'underline' }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}
