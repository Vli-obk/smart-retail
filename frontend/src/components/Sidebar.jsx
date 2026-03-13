import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle, 
  LogOut, 
  Users, 
  ChevronRight,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.error("Failed to parse user from localStorage");
  }
  
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18}/>, path: '/app/dashboard' },
    { name: 'Produits', icon: <Package size={18}/>, path: '/app/products' },
    { name: 'Ventes', icon: <ShoppingCart size={18}/>, path: '/app/sales' },
    { name: 'Alertes', icon: <AlertTriangle size={18}/>, path: '/app/alerts' },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800/50 sticky top-0 overflow-y-auto custom-scrollbar shadow-2xl">
      {/* Brand Section */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 ring-1 ring-blue-500/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white text-xl font-black tracking-tight leading-none">SmartRetail</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Enterprise AI</p>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="mx-6 mb-8 p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 ring-1 ring-blue-500/20 transition-all group-hover:ring-blue-500/50">
          <Users className="w-6 h-6" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{user?.name || 'Administrator'}</p>
          <p className="text-xs text-slate-500 font-medium truncate uppercase tracking-tighter">{user?.role || 'Admin'}</p>
        </div>
        <button className="text-slate-600 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-6">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Analyses Principales</p>
          {menuItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path} 
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'hover:bg-slate-800/50 hover:text-white'}
              `}
            >
              <span className={`transition-transform duration-200 group-hover:scale-110`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm flex-1">{item.name}</span>
              <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-40 transition-all -translate-x-2 group-hover:translate-x-0`} />
            </NavLink>
          ))}
        </div>

        {isAdmin && (
          <div className="space-y-1">
             <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Intelligence & Données</p>
            <NavLink 
              to="/app/clients" 
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-slate-800/50 hover:text-white'}
              `}
            >
              <Users size={18}/>
              <span className="font-semibold text-sm flex-1">Gestionnaires</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-all" />
            </NavLink>
            <NavLink 
              to="/app/predictions" 
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                  : 'hover:bg-slate-800/50 hover:text-white'}
              `}
            >
              <TrendingUp size={18}/>
              <span className="font-semibold text-sm flex-1">AI Stock Predictor</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-all" />
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 font-bold text-sm hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Déconnexion Sécurisée</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;