import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Alertes from './pages/Alertes';
import Predictions from './pages/Predictions';
import Sales from './pages/Sales'; 
import EnAttente from './pages/EnAttente';
import RegisterClient from './pages/RegisterClient';
import AdminDashboard from './pages/AdminDashboard';

import Sidebar from './components/Sidebar';

// Helper to check auth
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && token !== 'undefined' && token !== 'null';
};

// Layout component moved outside to prevent re-creation on every render
const AdminLayout = ({ children }) => (
  <div className="flex bg-slate-50 min-h-screen">
    <Sidebar />
    <main className="flex-1 min-w-0 overflow-y-auto">
      <div className="h-full">
        {children}
      </div>
    </main>
  </div>
);

function App() {

  return (
    <Router>
      <Routes>
        {/* 1. Pages bla Sidebar (Public) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterClient />} />

        {/* 2. Pages dyal l-Admin (Protected with Sidebar) */}
        <Route 
          path="/app/dashboard" 
          element={isAuthenticated() ? (
            JSON.parse(localStorage.getItem('user'))?.role === 'admin' 
              ? <AdminLayout><AdminDashboard /></AdminLayout> 
              : <AdminLayout><Dashboard /></AdminLayout>
          ) : <Navigate to="/login" />} 
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

        <Route 
  path="/app/en-attente" 
  element={isAuthenticated() ? <AdminLayout><EnAttente /></AdminLayout> : <Navigate to="/login" />} 
/>

        {/* Redirect ay 7aja khera l Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;