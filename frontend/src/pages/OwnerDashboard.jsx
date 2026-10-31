import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchOwnerDashboard = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/owner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch owner dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOwnerDashboard();
  }, [token, navigate]);

  const boxShadow = '0 4px 16px -2px rgba(45,38,30,0.06)';

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', paddingBottom: '48px', color: '#221f1c' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🏪</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', color: '#221f1c' }}>
            Store Owner Dashboard
          </h2>
        </div>
        <p style={{ color: '#756f66', fontSize: '14.5px' }}>
          Monitor your store's overall performance, average customer rating, and individual feedback.
        </p>
      </div>

      {error && (
        <div style={{
          color: '#a82e22',
          background: '#faedeb',
          border: '1px solid #f0cdc9',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '24px',
          fontWeight: '500',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2dcd2',
          color: '#756f66'
        }}>
          <p style={{ fontSize: '15px' }}>Loading dashboard data...</p>
        </div>
      ) : !dashboardData ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2dcd2',
          color: '#756f66'
        }}>
          <p style={{ fontSize: '15px' }}>No store information available.</p>
        </div>
      ) : (
        <div>
          {/* Store Info & Average Rating Card */}
          <div style={{
            padding: '28px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2dcd2',
            boxShadow,
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#756f66',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '6px'
              }}>
                Store Profile
              </span>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#221f1c', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                {dashboardData.store_info?.name || 'Your Store'}
              </p>
              <p style={{ fontSize: '13.5px', color: '#756f66' }}>
                📍 {dashboardData.store_info?.address || 'Address registered'}
              </p>
            </div>

            <div style={{
              padding: '14px 24px',
              background: '#f5eee3',
              borderRadius: '12px',
              border: '1px solid #e6dbca',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '200px'
            }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: '#756f66', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Average Rating
              </span>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#c58928' }}>
                ⭐ {dashboardData.store_info?.average_rating || 0} <span style={{ fontSize: '15px', color: '#756f66', fontWeight: '500' }}>/ 5</span>
              </span>
            </div>
          </div>

          {/* Raters List Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2dcd2',
            boxShadow,
            overflow: 'hidden',
            marginBottom: '32px'
          }}>
            <div style={{ padding: '20px 26px', borderBottom: '1px solid #e2dcd2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#221f1c' }}>Customers Who Rated Your Store</h3>
                <p style={{ fontSize: '13px', color: '#756f66', marginTop: '2px' }}>Detailed feedback and scores submitted by verified users</p>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                background: '#ede7dc',
                color: '#756f66',
                padding: '4px 10px',
                borderRadius: '20px'
              }}>
                {dashboardData.raters?.length || 0} reviews
              </span>
            </div>

            {!dashboardData.raters || dashboardData.raters.length === 0 ? (
              <p style={{ color: '#756f66', textAlign: 'center', padding: '40px', fontSize: '14px' }}>
                No ratings received yet. Wait till customers rates your store.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0ebe1', color: '#756f66', textTransform: 'uppercase', fontSize: '11.5px', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '14px 24px', borderBottom: '1px solid #e8e2d7' }}>Customer Name</th>
                      <th style={{ padding: '14px 24px', borderBottom: '1px solid #e8e2d7' }}>Email</th>
                      <th style={{ padding: '14px 24px', borderBottom: '1px solid #e8e2d7' }}>Rating</th>
                      <th style={{ padding: '14px 24px', borderBottom: '1px solid #e8e2d7' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.raters.map((rater, index) => (
                      <tr
                        key={index}
                        style={{ borderTop: '1px solid #e8e2d7', transition: 'background-color 0.15s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#faf7f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '14px 24px', fontWeight: '600', color: '#221f1c' }}>{rater.name}</td>
                        <td style={{ padding: '14px 24px', color: '#756f66' }}>{rater.email}</td>
                        <td style={{ padding: '14px 24px', fontWeight: '700', color: '#c58928' }}>
                          ⭐ {rater.rating} / 5
                        </td>
                        <td style={{ padding: '14px 24px', color: '#756f66' }}>
                          {new Date(rater.rated_on).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Update Section */}
      <PasswordUpdateSection />
    </div>
  );
}

function PasswordUpdateSection() {
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setSubmitting(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/auth/update-password`, passData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSuccess(true);
      setMsg(res.data.message || 'Password updated successfully!');
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setIsSuccess(false);
      setMsg(err.response?.data?.error || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      padding: '28px',
      background: '#ffffff',
      borderRadius: '14px',
      border: '1px solid #e2dcd2',
      boxShadow: '0 4px 16px -2px rgba(45,38,30,0.06)'
    }}>
      <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: '#221f1c' }}>
        Update Password
      </h4>
      <p style={{ color: '#756f66', fontSize: '13px', marginBottom: '18px' }}>
        Change your account security password (8-16 characters, 1 uppercase, 1 special character).
      </p>

      {msg && (
        <div style={{
          color: isSuccess ? '#2f592a' : '#a82e22',
          background: isSuccess ? '#edf5ec' : '#faedeb',
          border: `1px solid ${isSuccess ? '#c8e0c6' : '#f0cdc9'}`,
          padding: '11px 14px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: '500',
          fontSize: '13px'
        }}>
          {msg}
        </div>
      )}

      <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <input
          type="password"
          placeholder="Current Password"
          required
          value={passData.oldPassword}
          onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid #dcd4c7',
            background: '#fbf9f6',
            color: '#221f1c',
            flex: '1',
            minWidth: '220px',
            outline: 'none',
            fontSize: '13.5px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2c2825'}
          onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
        />
        <input
          type="password"
          placeholder="New Password (8-16 chars, 1 Upper, 1 Special)"
          required
          value={passData.newPassword}
          onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid #dcd4c7',
            background: '#fbf9f6',
            color: '#221f1c',
            flex: '1',
            minWidth: '280px',
            outline: 'none',
            fontSize: '13.5px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2c2825'}
          onBlur={(e) => e.target.style.borderColor = '#dcd4c7'}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 22px',
            background: '#2c2825',
            color: '#faf8f4',
            border: 'none',
            borderRadius: '8px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '13.5px',
            opacity: submitting ? 0.7 : 1,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {submitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
