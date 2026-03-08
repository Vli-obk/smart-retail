import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Alertes from './pages/Alertes';
import Predictions from './pages/Predictions';
import Sales from './pages/Sales'; // Khtarna Sales hit hiya li m-importya

import Sidebar from './components/Sidebar';

function App() {
  // Fonction bach n-choufou wach l-admin dakhil
  const isAuthenticated = () => !!localStorage.getItem('token');

  // Layout li kiy-khli Sidebar i-ban dima f l-Admin
  const AdminLayout = ({ children }) => (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* 1. Pages bla Sidebar (Public) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 2. Pages dyal l-Admin (Protected with Sidebar) */}
        <Route 
          path="/app/dashboard" 
          element={isAuthenticated() ? <AdminLayout><Dashboard /></AdminLayout> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/app/clients" 
          element={isAuthenticated() ? <AdminLayout><Clients /></AdminLayout> : <Navigate to="/login" />} 
        />

        <Route 
          path="/app/products" 
          element={isAuthenticated() ? <AdminLayout><Products /></AdminLayout> : <Navigate to="/login" />} 
        />

        <Route 
          path="/app/sales" 
          element={isAuthenticated() ? <AdminLayout><Sales /></AdminLayout> : <Navigate to="/login" />} 
        />

        <Route 
          path="/app/alerts" 
          element={isAuthenticated() ? <AdminLayout><Alertes /></AdminLayout> : <Navigate to="/login" />} 
        />

        <Route 
          path="/app/predictions" 
          element={isAuthenticated() ? <AdminLayout><Predictions /></AdminLayout> : <Navigate to="/login" />} 
        />

        {/* Redirect ay 7aja khera l Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;