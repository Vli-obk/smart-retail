import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, subtitle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Déconnexion
      </button>
    </div>
  );
};

export default Header;
