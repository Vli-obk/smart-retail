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
import ClientDashboard from './pages/ClientDashboard';

import Sidebar from './components/Sidebar';

// Layout component
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

// Unified Protected Route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = token && token !== 'undefined' && token !== 'null';

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/app/dashboard" replace />;
  // Restrict stock manager certain pages if needed, but for now we focus on Client/Admin/StockManager
  
  return <AdminLayout>{children}</AdminLayout>;
};

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
          element={
            <ProtectedRoute>
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.role === 'admin') return <AdminDashboard />;
                if (user.role === 'client') return <ClientDashboard />;
                return <Dashboard />;
              })()}
            </ProtectedRoute>
          } 
        />
        
        <Route path="/app/clients" element={<ProtectedRoute adminOnly><Clients /></ProtectedRoute>} />
        <Route path="/app/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/app/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
        <Route path="/app/alerts" element={<ProtectedRoute><Alertes /></ProtectedRoute>} />
        <Route path="/app/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
        <Route path="/app/en-attente" element={<ProtectedRoute><EnAttente /></ProtectedRoute>} />

        {/* Redirect ay 7aja khera l Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;