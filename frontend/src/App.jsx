import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#282522',
      borderBottom: '1px solid #38342e',
      padding: '16px 28px',
      color: '#faf7f2',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', color: '#faf7f2' }}>
          Store Rating App
        </span>
      </div>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        {token ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              background: '#3b362e',
              color: '#ebdcc7',
              border: '1px solid #4d463b',
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
  return (
    <Router>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        backgroundColor: '#f6f3ed',
        color: '#332f2a',
        minHeight: '100vh',
      }}>
        <Navbar />

        <div style={{ padding: '32px 24px', maxWidth: '1240px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
