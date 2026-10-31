import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function AdminDashboard({ darkMode }) {
  const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [storeData, setStoreData] = useState({ name: '', email: '', address: '' });
  const [userData, setUserData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  
  // Sorting state for tables
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'ASC' });
  const [userSort, setUserSort] = useState({ field: 'name', order: 'ASC' });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data || { total_users: 0, total_stores: 0, total_ratings: 0 });
    } catch (err) { 
      console.error(err); 
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stores?search=${filters.name}&sortBy=${storeSort.field}&order=${storeSort.order}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data.data || []);
    } catch (err) { 
      console.error(err); 
    }
  };

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams({ ...filters, sortBy: userSort.field, order: userSort.order }).toString();
      const res = await axios.get(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data || []);
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => {
    if (!token) { 
      navigate('/login'); 
      return; 
    }
    fetchStats();
    fetchStores();
    fetchUsers();
  }, [token, navigate, filters, storeSort, userSort]);

  const handleStoreSort = (field) => {
    const order = storeSort.field === field && storeSort.order === 'ASC' ? 'DESC' : 'ASC';
    setStoreSort({ field, order });
  };

  const handleUserSort = (field) => {
    const order = userSort.field === field && userSort.order === 'ASC' ? 'DESC' : 'ASC';
    setUserSort({ field, order });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/stores`, storeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSuccess(true);
      setMessage(res.data.message || 'Store added successfully');
      setStoreData({ name: '', email: '', address: '' });
      fetchStats(); 
      fetchStores();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) { 
      setIsSuccess(false);
      setMessage(err.response?.data?.error || 'Failed to add store'); 
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (userData.name.length < 20 || userData.name.length > 60) {
      setIsSuccess(false);
      setMessage('Name must be between 20 and 60 characters.');
      return;
    }
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!pwdRegex.test(userData.password)) {
      setIsSuccess(false);
      setMessage('Password must be 8-16 chars, include 1 uppercase and 1 special character.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/admin/users`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSuccess(true);
      setMessage(res.data.message || 'User added successfully');
      setUserData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchStats(); 
      fetchUsers();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) { 
      setIsSuccess(false);
      setMessage(err.response?.data?.error || 'Failed to add user'); 
    }
  };

  // Beige and Grey Theme Palette
  const bgCard = darkMode ? '#22201d' : '#ffffff';
  const textMain = darkMode ? '#f4efe6' : '#221f1c';
  const textMuted = darkMode ? '#9e978c' : '#756f66';
  const borderCol = darkMode ? '#38352f' : '#e2dcd2';
  const inputBg = darkMode ? '#1a1917' : '#fbf9f6';
  const inputBorder = darkMode ? '#3d3932' : '#dcd4c7';
  const primaryBtnBg = darkMode ? '#d5c7b3' : '#2c2825';
  const primaryBtnText = darkMode ? '#1c1a17' : '#faf8f4';
  const secondaryBtnBg = darkMode ? '#3b3731' : '#453f38';
  const secondaryBtnText = darkMode ? '#f4efe6' : '#faf8f4';
  const tableHeaderBg = darkMode ? '#1c1b18' : '#f0ebe1';
  const tableBorder = darkMode ? '#35322d' : '#e8e2d7';

  // Role Badge Helper in Beige & Grey
  const getRoleBadge = (role) => {
    if (role === 'SYSTEM_ADMIN') {
      return {
        bg: darkMode ? '#38342e' : '#2c2825',
        color: darkMode ? '#f4efe6' : '#faf7f2',
        border: darkMode ? '#4a443c' : '#2c2825'
      };
    }
    if (role === 'STORE_OWNER') {
      return {
        bg: darkMode ? '#322b22' : '#ebe2d5',
        color: darkMode ? '#dfd2c0' : '#453a2d',
        border: darkMode ? '#473d30' : '#ddcebc'
      };
    }
    return {
      bg: darkMode ? '#262421' : '#ede9e1',
      color: darkMode ? '#c7bfb2' : '#4a443b',
      border: darkMode ? '#383530' : '#ded7cb'
    };
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '48px', color: textMain }}>
      
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '22px' }}>⚙️</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.02em', color: textMain }}>
            System Administrator Dashboard
          </h2>
        </div>
        <p style={{ color: textMuted, fontSize: '14.5px' }}>
          Manage platform analytics, register stores, invite users, and review filtered directories.
        </p>
      </div>

      {message && (
        <div style={{ 
          padding: '12px 18px', 
          background: isSuccess ? (darkMode ? '#172b1a' : '#edf5ec') : (darkMode ? '#321d1b' : '#faedeb'), 
          color: isSuccess ? (darkMode ? '#86efac' : '#2f592a') : (darkMode ? '#fca5a5' : '#a82e22'), 
          border: `1px solid ${isSuccess ? (darkMode ? '#2c5230' : '#c8e0c6') : (darkMode ? '#542823' : '#f0cdc9')}`,
          borderRadius: '10px', 
          marginBottom: '24px', 
          fontWeight: '600',
          fontSize: '13.5px'
        }}>
          {message}
        </div>
      )}

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ 
          background: bgCard, 
          padding: '24px', 
          borderRadius: '14px', 
          border: `1px solid ${borderCol}`,
          boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: textMuted, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Users
            </p>
            <span style={{ fontSize: '18px' }}>👥</span>
          </div>
          <h3 style={{ fontSize: '34px', fontWeight: '800', color: textMain, marginTop: '8px', letterSpacing: '-0.03em' }}>
            {stats.total_users}
          </h3>
          <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>Registered platform accounts</p>
        </div>

        <div style={{ 
          background: bgCard, 
          padding: '24px', 
          borderRadius: '14px', 
          border: `1px solid ${borderCol}`,
          boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: textMuted, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Stores
            </p>
            <span style={{ fontSize: '18px' }}>🏬</span>
          </div>
          <h3 style={{ fontSize: '34px', fontWeight: '800', color: textMain, marginTop: '8px', letterSpacing: '-0.03em' }}>
            {stats.total_stores}
          </h3>
          <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>Active retail store listings</p>
        </div>

        <div style={{ 
          background: bgCard, 
          padding: '24px', 
          borderRadius: '14px', 
          border: `1px solid ${borderCol}`,
          boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: textMuted, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Ratings
            </p>
            <span style={{ fontSize: '18px' }}>⭐</span>
          </div>
          <h3 style={{ fontSize: '34px', fontWeight: '800', color: '#c58928', marginTop: '8px', letterSpacing: '-0.03em' }}>
            {stats.total_ratings}
          </h3>
          <p style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>Customer submitted scores</p>
        </div>
      </div>

      {/* Forms Section: Add Store & Add User */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Add Store Card */}
        <div style={{ 
          background: bgCard, 
          padding: '26px', 
          borderRadius: '14px', 
          border: `1px solid ${borderCol}`,
          boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
        }}>
          <div style={{ borderBottom: `1px solid ${borderCol}`, paddingBottom: '12px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: textMain }}>Add New Store</h3>
            <p style={{ fontSize: '12.5px', color: textMuted, marginTop: '2px' }}>Register a new store into the directory</p>
          </div>
          <form onSubmit={handleAddStore} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="text" 
              placeholder="Store Name (e.g. Alex Central Retail Store)" 
              required 
              value={storeData.name} 
              onChange={(e) => setStoreData({...storeData, name: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <input 
              type="email" 
              placeholder="Store Email (e.g. alex.store@example.com)" 
              required 
              value={storeData.email} 
              onChange={(e) => setStoreData({...storeData, email: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <input 
              type="text" 
              placeholder="Store Address (e.g. 100 Main St, Pune, India)" 
              required 
              value={storeData.address} 
              onChange={(e) => setStoreData({...storeData, address: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <button 
              type="submit" 
              style={{ 
                padding: '12px', 
                background: primaryBtnBg, 
                color: primaryBtnText, 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                fontSize: '13.5px',
                marginTop: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              + Create Store
            </button>
          </form>
        </div>

        {/* Add User Card */}
        <div style={{ 
          background: bgCard, 
          padding: '26px', 
          borderRadius: '14px', 
          border: `1px solid ${borderCol}`,
          boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
        }}>
          <div style={{ borderBottom: `1px solid ${borderCol}`, paddingBottom: '12px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: textMain }}>Add New User</h3>
            <p style={{ fontSize: '12.5px', color: textMuted, marginTop: '2px' }}>Provision a new platform administrator, owner, or user</p>
          </div>
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input 
              type="text" 
              placeholder="Full Name (20-60 chars, e.g. Alex System Administrator)" 
              required 
              value={userData.name} 
              onChange={(e) => setUserData({...userData, name: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <input 
              type="email" 
              placeholder="Email (e.g. alex.admin@example.com)" 
              required 
              value={userData.email} 
              onChange={(e) => setUserData({...userData, email: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <input 
              type="password" 
              placeholder="Password (8-16 chars, 1 Upper, 1 Special)" 
              required 
              value={userData.password} 
              onChange={(e) => setUserData({...userData, password: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <input 
              type="text" 
              placeholder="Address (Max 400 characters)" 
              required 
              value={userData.address} 
              onChange={(e) => setUserData({...userData, address: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }} 
            />
            <select 
              value={userData.role} 
              onChange={(e) => setUserData({...userData, role: e.target.value})} 
              style={{ padding: '11px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', outline: 'none', fontSize: '13.5px' }}
            >
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="SYSTEM_ADMIN">System Admin</option>
            </select>
            <button 
              type="submit" 
              style={{ 
                padding: '12px', 
                background: secondaryBtnBg, 
                color: secondaryBtnText, 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: '700', 
                cursor: 'pointer', 
                fontSize: '13.5px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              + Create User
            </button>
          </form>
        </div>
      </div>

      {/* Filters Section */}
      <div style={{ 
        background: bgCard, 
        padding: '22px 26px', 
        borderRadius: '14px', 
        border: `1px solid ${borderCol}`, 
        marginBottom: '32px',
        boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
      }}>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16.5px', fontWeight: '700', color: textMain }}>Filter Directories</h3>
          <p style={{ fontSize: '12.5px', color: textMuted }}>Filter users and stores simultaneously by name, email, address, or role</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Search by Name..." 
            value={filters.name} 
            onChange={(e) => setFilters({...filters, name: e.target.value})} 
            style={{ padding: '10px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', fontSize: '13px', outline: 'none' }} 
          />
          <input 
            type="text" 
            placeholder="Search by Email..." 
            value={filters.email} 
            onChange={(e) => setFilters({...filters, email: e.target.value})} 
            style={{ padding: '10px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', fontSize: '13px', outline: 'none' }} 
          />
          <input 
            type="text" 
            placeholder="Search by Address..." 
            value={filters.address} 
            onChange={(e) => setFilters({...filters, address: e.target.value})} 
            style={{ padding: '10px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', fontSize: '13px', outline: 'none' }} 
          />
          <select 
            value={filters.role} 
            onChange={(e) => setFilters({...filters, role: e.target.value})} 
            style={{ padding: '10px 14px', background: inputBg, border: `1px solid ${inputBorder}`, color: textMain, borderRadius: '8px', fontSize: '13px', outline: 'none' }}
          >
            <option value="">All Roles</option>
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
            <option value="SYSTEM_ADMIN">System Admin</option>
          </select>
        </div>
      </div>

      {/* Stores Directory Table (with Sorting) */}
      <div style={{ 
        background: bgCard, 
        borderRadius: '14px', 
        border: `1px solid ${borderCol}`, 
        marginBottom: '32px', 
        overflow: 'hidden',
        boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
      }}>
        <div style={{ padding: '20px 26px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: textMain }}>Registered Stores Listing</h3>
            <p style={{ fontSize: '12.5px', color: textMuted }}>Click table column headers to sort ascending / descending</p>
          </div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            background: darkMode ? '#2d2a25' : '#ede7dc', 
            color: textMuted, 
            padding: '4px 10px', 
            borderRadius: '20px' 
          }}>
            {stores.length} stores
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: tableHeaderBg, color: textMuted, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th onClick={() => handleStoreSort('name')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Store Name {storeSort.field === 'name' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => handleStoreSort('email')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Email {storeSort.field === 'email' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => handleStoreSort('address')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Address {storeSort.field === 'address' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => handleStoreSort('overall_rating')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Overall Rating {storeSort.field === 'overall_rating' ? (storeSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: textMuted }}>
                    No stores match the current filters.
                  </td>
                </tr>
              ) : (
                stores.map(store => (
                  <tr 
                    key={store.store_id} 
                    style={{ borderTop: `1px solid ${tableBorder}`, transition: 'background-color 0.15s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#282521' : '#faf7f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 24px', fontWeight: '600', color: textMain }}>{store.name}</td>
                    <td style={{ padding: '14px 24px', color: textMuted }}>{store.email}</td>
                    <td style={{ padding: '14px 24px', color: textMuted }}>{store.address}</td>
                    <td style={{ padding: '14px 24px', fontWeight: '700', color: '#c58928' }}>
                      ⭐ {store.overall_rating || 0} / 5
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Directory Table (with Sorting) */}
      <div style={{ 
        background: bgCard, 
        borderRadius: '14px', 
        border: `1px solid ${borderCol}`, 
        overflow: 'hidden',
        boxShadow: darkMode ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 14px -2px rgba(45,38,30,0.05)'
      }}>
        <div style={{ padding: '20px 26px', borderBottom: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: textMain }}>Users Directory</h3>
            <p style={{ fontSize: '12.5px', color: textMuted }}>Platform users, assigned roles, and verified store owner ratings</p>
          </div>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            background: darkMode ? '#2d2a25' : '#ede7dc', 
            color: textMuted, 
            padding: '4px 10px', 
            borderRadius: '20px' 
          }}>
            {users.length} users
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: tableHeaderBg, color: textMuted, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th onClick={() => handleUserSort('name')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Name {userSort.field === 'name' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => handleUserSort('email')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Email {userSort.field === 'email' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => handleUserSort('address')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Address {userSort.field === 'address' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => handleUserSort('role')} style={{ padding: '14px 24px', cursor: 'pointer', userSelect: 'none', borderBottom: `1px solid ${tableBorder}` }}>
                  Role {userSort.field === 'role' ? (userSort.order === 'ASC' ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '14px 24px', borderBottom: `1px solid ${tableBorder}` }}>Owner Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: textMuted }}>
                    No users match the current filters.
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const badgeStyle = getRoleBadge(u.role);
                  return (
                    <tr 
                      key={u.id} 
                      style={{ borderTop: `1px solid ${tableBorder}`, transition: 'background-color 0.15s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#282521' : '#faf7f2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px 24px', fontWeight: '600', color: textMain }}>{u.name}</td>
                      <td style={{ padding: '14px 24px', color: textMuted }}>{u.email}</td>
                      <td style={{ padding: '14px 24px', color: textMuted }}>{u.address}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontSize: '11.5px', 
                          fontWeight: '700', 
                          background: badgeStyle.bg, 
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                          letterSpacing: '0.04em'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', fontWeight: '600' }}>
                        {u.role === 'STORE_OWNER' ? (
                          <span style={{ color: '#c58928', fontWeight: '700' }}>
                            ⭐ {u.owner_rating || 0} / 5
                          </span>
                        ) : (
                          <span style={{ color: textMuted }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
