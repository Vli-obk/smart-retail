import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

// Configure axios defaults
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
}

// SVG Icons (inline, no library)
const Icons = {
  logo: (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#3b7fff"/>
      <path d="M8 20L12 12L16 18L20 10L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  commandes: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 7H15M5 10H15M5 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  alertes: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 5V12M10 15V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 8C4 5 6 3 10 3C14 3 16 5 16 8V13L18 15V16H2V15L4 13V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  produits: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 7V5C7 3.34315 8.34315 2 10 2C11.6569 2 13 3.34315 13 5V7" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  predictions: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 18L7 12L11 16L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="9" r="2" fill="#3b7fff"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 14L3 9L7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 9H12M12 9C14 9 15 8 15 6V4C15 2 14 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  gear: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 2V4M8 12V14M2 8H4M12 8H14M3.05 3.05L4.46 4.46M11.54 11.54L12.95 12.95M3.05 12.95L4.46 11.54M11.54 4.46L12.95 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  avatar: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="18" fill="#3b7fff" fillOpacity="0.2"/>
      <circle cx="18" cy="14" r="6" fill="#3b7fff"/>
      <path d="M8 30C8 24 12 20 18 20C24 20 28 24 28 30" fill="#3b7fff"/>
    </svg>
  )
};

const StockManagerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      // Silent fail
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItem = (path, icon, label) => {
    const active = isActive(path);
    return (
      <Link
        key={path}
        to={path}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: active ? '#ffffff' : '#94a3b8',
          backgroundColor: active ? '#3b7fff' : 'transparent',
          transition: 'all 0.2s',
          marginBottom: '4px'
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {icon}
        {label}
      </Link>
    );
  };

  const sectionLabel = (text) => (
    <div
      style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: '#475569',
        marginBottom: '8px',
        paddingLeft: '4px',
        marginTop: '16px'
      }}
    >
      {text}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '260px',
          height: '100vh',
          backgroundColor: '#0f172a',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          zIndex: 100
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          {Icons.logo}
          <div>
            <div
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: '#ffffff'
              }}
            >
              SmartRetail
            </div>
            <div
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1px',
                color: '#64748b',
                textTransform: 'uppercase'
              }}
            >
              Enterprise AI
            </div>
          </div>
        </div>

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            marginBottom: '24px'
          }}
        >
          {Icons.avatar}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#ffffff'
              }}
            >
              {user?.name || 'Stock Manager'}
            </div>
            <div
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                color: '#64748b',
                textTransform: 'uppercase'
              }}
            >
              Stock Manager
            </div>
          </div>
          <div style={{ color: '#64748b', cursor: 'pointer' }}>{Icons.gear}</div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {sectionLabel('Analyses Principales')}
          {navItem('/stock-manager/dashboard', Icons.dashboard, 'Dashboard')}
          {navItem('/stock-manager/commandes', Icons.commandes, 'Commandes')}
          {navItem('/stock-manager/alertes', Icons.alertes, 'Alertes')}

          {sectionLabel('Intelligence & Données')}
          {navItem('/stock-manager/produits', Icons.produits, 'Produits')}
          {navItem('/stock-manager/predictions', Icons.predictions, 'Prédictions IA')}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: '#ef4444',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {Icons.logout}
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main
        style={{
          marginLeft: '260px',
          padding: '32px',
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          flex: 1,
          boxSizing: 'border-box'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default StockManagerLayout;
