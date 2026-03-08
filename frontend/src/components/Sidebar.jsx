import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, AlertTriangle, LogOut, Users, Home } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  // 1. Kan-akhdou l-user men l-localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    navigate('/login');
  };

  // 2. L-menu l-3adi
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/app/dashboard' },
    { name: 'Produits', icon: <Package size={20}/>, path: '/app/products' },
    { name: 'Ventes', icon: <ShoppingCart size={20}/>, path: '/app/sales' },
    { name: 'Alertes', icon: <AlertTriangle size={20}/>, path: '/app/alerts' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-xl font-bold border-b border-slate-800 text-blue-400">
        SmartRetail AI
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        
        {/* --- BOUTON ACCUEIL SITE (ZDT HNA) --- */}
        <Link 
          to="/" 
          className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition mb-4 border-b border-slate-800 pb-4"
        >
          <Home size={20}/>
          <span className="font-medium">Accueil Site</span>
        </Link>

        {/* Affichag dyal l-menu l-3adi */}
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        {/* --- HAD L-BLASSA KHASSA GHIR B L-ADMIN --- */}
        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-2 px-3 uppercase tracking-wider">Administration</p>
            <Link 
              to="/app/clients" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-blue-400 font-medium"
            >
              <Users size={20}/>
              <span>Gestion Clients</span>
            </Link>
            <Link 
              to="/app/predictions" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-blue-400 font-medium"
            >
              <TrendingUp size={20}/>
              <span>Prédictions AI</span>
            </Link>
          </div>
        )}
      </nav>

      <button 
        onClick={handleLogout}
        className="p-4 flex items-center gap-3 text-red-400 hover:bg-slate-800 mt-auto border-t border-slate-800"
      >
        <LogOut size={20}/>
        <span>Déconnexion</span>
      </button>
    </div>
  );
};

export default Sidebar;