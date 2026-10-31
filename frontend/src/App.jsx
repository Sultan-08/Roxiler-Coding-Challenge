import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

function Navbar({ darkMode, setDarkMode }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Beige and Grey Navbar palette
  const navBg = darkMode ? '#1a1917' : '#282522';
  const navBorder = darkMode ? '#2e2b26' : '#38342e';
  const brandText = darkMode ? '#f4efe6' : '#faf7f2';
  const toggleBtnBg = darkMode ? '#26231f' : '#35312b';
  const toggleBtnBorder = darkMode ? '#3e3932' : '#47423a';
  const toggleBtnText = darkMode ? '#ded7cb' : '#f1ebe0';

  return (
    <nav style={{
      backgroundColor: navBg,
      borderBottom: `1px solid ${navBorder}`,
      padding: '16px 28px',
      color: brandText,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', color: brandText }}>
          Roxiler Portal
        </span>
      </div>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: toggleBtnBg,
            border: `1px solid ${toggleBtnBorder}`,
            color: toggleBtnText,
            padding: '7px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          title="Toggle light and dark theme"
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>

        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              background: darkMode ? '#2e2a24' : '#3b362e',
              color: darkMode ? '#ded5c5' : '#ebdcc7',
              border: `1px solid ${darkMode ? '#433d34' : '#4d463b'}`,
              padding: '5px 10px',
              borderRadius: '6px',
              letterSpacing: '0.04em'
            }}>
              {role}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#9a3424',
                color: '#faf7f2',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#84291b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9a3424'}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/login"
              style={{
                color: toggleBtnText,
                textDecoration: 'none',
                padding: '7px 14px',
                fontWeight: '600',
                fontSize: '13px',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              style={{
                color: '#24211e',
                textDecoration: 'none',
                padding: '7px 14px',
                background: '#dcd3c4',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'background-color 0.2s'
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Beige and grey background and text
  const appBg = darkMode ? '#151413' : '#f6f3ed';
  const appColor = darkMode ? '#ded7cc' : '#332f2a';

  return (
    <Router>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        backgroundColor: appBg,
        color: appColor,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div style={{ padding: '32px 24px', maxWidth: '1240px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup darkMode={darkMode} />} />
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/admin" element={<AdminDashboard darkMode={darkMode} />} />
            <Route path="/owner" element={<OwnerDashboard darkMode={darkMode} />} />
            <Route path="/user" element={<UserDashboard darkMode={darkMode} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
