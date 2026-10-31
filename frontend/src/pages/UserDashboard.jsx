import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function UserDashboard({ darkMode }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stores?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data.data || []);
    } catch (err) {
      console.error("Error fetching stores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStores();
  }, [search, token, navigate]);

  const handleRatingSubmit = async (store_id) => {
    const ratingValue = ratings[store_id];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/ratings`, {
        store_id,
        rating: parseInt(ratingValue, 10)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(res.data.message || 'Rating submitted successfully!');
      fetchStores();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
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
  const starCol = '#c58928';

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto', paddingBottom: '48px', color: textMain }}>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>⭐</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', color: textMain }}>
            Store Directory & Ratings
          </h2>
        </div>
        <p style={{ color: textMuted, fontSize: '14.5px' }}>
          Explore registered stores, submit customer feedback ratings, or modify your existing scores.
        </p>
      </div>

      {message && (
        <div style={{
          padding: '12px 18px',
          background: darkMode ? '#172b1a' : '#edf5ec',
          color: darkMode ? '#86efac' : '#2f592a',
          border: `1px solid ${darkMode ? '#2c5230' : '#c8e0c6'}`,
          borderRadius: '10px',
          marginBottom: '24px',
          fontWeight: '600',
          fontSize: '13.5px'
        }}>
          {message}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '28px' }}>
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 18px',
            borderRadius: '12px',
            border: `1px solid ${inputBorder}`,
            background: inputBg,
            color: textMain,
            outline: 'none',
            fontSize: '14.5px',
            boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(45,38,30,0.04)',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = darkMode ? '#d5c7b3' : '#2c2825'}
          onBlur={(e) => e.target.style.borderColor = inputBorder}
        />
      </div>

      {/* Stores List */}
      <div style={{ display: 'grid', gap: '18px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: bgCard,
            borderRadius: '14px',
            border: `1px solid ${borderCol}`,
            color: textMuted
          }}>
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: bgCard,
            borderRadius: '14px',
            border: `1px solid ${borderCol}`,
            color: textMuted
          }}>
            <p style={{ fontSize: '15px' }}>No stores found matching your criteria.</p>
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store.store_id}
              style={{
                padding: '24px 26px',
                backgroundColor: bgCard,
                borderRadius: '14px',
                border: `1px solid ${borderCol}`,
                boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px -2px rgba(45,38,30,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '18px',
                transition: 'border-color 0.2s ease'
              }}
            >
              <div style={{ flex: '1', minWidth: '260px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: '800', marginBottom: '6px', color: textMain }}>
                  {store.name}
                </h3>
                <p style={{ color: textMuted, fontSize: '13.5px', marginBottom: '8px' }}>
                  📍 {store.address}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: starCol }}>
                    Overall Rating: ⭐ {store.overall_rating || 0} / 5
                  </span>
                  {store.user_submitted_rating ? (
                    <span style={{
                      color: darkMode ? '#86efac' : '#2f592a',
                      background: darkMode ? '#1a2e1d' : '#edf5ec',
                      border: `1px solid ${darkMode ? '#2c5332' : '#c8e0c6'}`,
                      fontSize: '12.5px',
                      fontWeight: '600',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      Your Rating: ⭐ {store.user_submitted_rating}
                    </span>
                  ) : (
                    <span style={{ color: textMuted, fontSize: '12.5px' }}>
                      Not rated by you yet
                    </span>
                  )}
                </div>
              </div>

              {/* Rating Action Form */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={ratings[store.store_id] || store.user_submitted_rating || ''}
                  onChange={(e) => setRatings({ ...ratings, [store.store_id]: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${inputBorder}`,
                    background: inputBg,
                    color: textMain,
                    outline: 'none',
                    fontSize: '13.5px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select Score -</option>
                  <option value="1">1 : Poor</option>
                  <option value="2">2 : Fair</option>
                  <option value="3">3 : Good</option>
                  <option value="4">4 : Very Good</option>
                  <option value="5">5 : Excellent</option>
                </select>
                <button
                  onClick={() => handleRatingSubmit(store.store_id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: primaryBtnBg,
                    color: primaryBtnText,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '13.5px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'opacity 0.2s'
                  }}
                >
                  {store.user_submitted_rating ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Password Update Component */}
      <PasswordUpdateSection darkMode={darkMode} />

    </div>
  );
}

function PasswordUpdateSection({ darkMode }) {
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

  const bgCard = darkMode ? '#22201d' : '#ffffff';
  const textMain = darkMode ? '#f4efe6' : '#221f1c';
  const textMuted = darkMode ? '#9e978c' : '#756f66';
  const borderCol = darkMode ? '#38352f' : '#e2dcd2';
  const inputBg = darkMode ? '#1a1917' : '#fbf9f6';
  const inputBorder = darkMode ? '#3d3932' : '#dcd4c7';
  const primaryBtnBg = darkMode ? '#d5c7b3' : '#2c2825';
  const primaryBtnText = darkMode ? '#1c1a17' : '#faf8f4';

  return (
    <div style={{
      marginTop: '40px',
      padding: '28px',
      background: bgCard,
      borderRadius: '14px',
      border: `1px solid ${borderCol}`,
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px -2px rgba(45,38,30,0.06)'
    }}>
      <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px', color: textMain }}>
        Update Password
      </h4>
      <p style={{ color: textMuted, fontSize: '13px', marginBottom: '18px' }}>
        Change your account security password (8-16 characters, 1 uppercase, 1 special character).
      </p>

      {msg && (
        <div style={{
          color: isSuccess ? (darkMode ? '#86efac' : '#2f592a') : (darkMode ? '#fca5a5' : '#a82e22'),
          background: isSuccess ? (darkMode ? '#172b1a' : '#edf5ec') : (darkMode ? '#321d1b' : '#faedeb'),
          border: `1px solid ${isSuccess ? (darkMode ? '#2c5230' : '#c8e0c6') : (darkMode ? '#542823' : '#f0cdc9')}`,
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
            border: `1px solid ${inputBorder}`,
            background: inputBg,
            color: textMain,
            flex: '1',
            minWidth: '220px',
            outline: 'none',
            fontSize: '13.5px'
          }}
          onFocus={(e) => e.target.style.borderColor = darkMode ? '#d5c7b3' : '#2c2825'}
          onBlur={(e) => e.target.style.borderColor = inputBorder}
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
            border: `1px solid ${inputBorder}`,
            background: inputBg,
            color: textMain,
            flex: '1',
            minWidth: '280px',
            outline: 'none',
            fontSize: '13.5px'
          }}
          onFocus={(e) => e.target.style.borderColor = darkMode ? '#d5c7b3' : '#2c2825'}
          onBlur={(e) => e.target.style.borderColor = inputBorder}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 22px',
            background: primaryBtnBg,
            color: primaryBtnText,
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
