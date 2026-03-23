import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Inline SVG Icons
const Icons = {
  products: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="16" height="12" rx="2" stroke="#3b7fff" strokeWidth="1.5"/>
      <path d="M8 8V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V8" stroke="#3b7fff" strokeWidth="1.5"/>
      <circle cx="12" cy="14" r="2" fill="#3b7fff"/>
    </svg>
  ),
  orders: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8H18M6 12H15M6 16H12" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#8b5cf6" strokeWidth="1.5"/>
    </svg>
  ),
  revenue: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V22M12 22L7 17M12 22L17 17" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12H7M17 12H21" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  alerts: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6V13M12 18V19" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 10C5 6 7 4 12 4C17 4 19 6 19 10V15L21 17V18H3V17L5 15V10Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  spinner: (
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
      <circle cx="20" cy="20" r="16" fill="none" stroke="#3b7fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="25 100">
        <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  statusDot: (color) => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill={color}/>
    </svg>
  )
};

const SMDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsRes = await axios.get('/api/stock-manager/stats', { headers });
      setStats(statsRes.data.data);

      // Fetch orders for chart and recent list
      const ordersRes = await axios.get('/api/orders', { headers });
      const allOrders = ordersRes.data.data || [];
      setOrders(allOrders.slice(0, 5));

      // Fetch products for alerts
      const productsRes = await axios.get('/api/products', { headers });
      const allProducts = productsRes.data.data || [];
      setProducts(allProducts);

      // Generate chart data from orders
      const monthlyData = generateChartData(allOrders);
      setChartData(monthlyData);

      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (orders) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = months.map(month => ({ month, revenus: 0, ventes: 0 }));

    orders.forEach(order => {
      if (order.status === 'approved') {
        const date = new Date(order.created_at);
        const monthIndex = date.getMonth();
        data[monthIndex].revenus += parseFloat(order.total_amount) || 0;
        data[monthIndex].ventes += 1;
      }
    });

    return data;
  };

  const formatCurrency = (value) => {
    return value ? `${parseFloat(value).toFixed(2)} DH` : '0.00 DH';
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fff7ed', text: '#f59e0b', label: 'En attente' },
      approved: { bg: '#f0fdf4', text: '#10b981', label: 'Approuvée' },
      rejected: { bg: '#fef2f2', text: '#ef4444', label: 'Rejetée' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.text,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '20px',
        padding: '3px 10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {Icons.statusDot(style.text)}
        {style.label}
      </span>
    );
  };

  const lowStockProducts = products.filter(p => 
    parseInt(p.quantity) <= parseInt(p.low_stock_threshold || 10)
  ).slice(0, 5);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        {Icons.spinner}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        padding: '16px',
        color: '#ef4444',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        Erreur: {error}
      </div>
    );
  }

  // Stat Card Component
  const StatCard = ({ icon, value, label, trend, color }) => (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          backgroundColor: `${color}15`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            color: trend.startsWith('+') ? '#10b981' : '#64748b'
          }}>
            {trend}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: 'DM Serif Display, serif',
        fontSize: '32px',
        color: '#0f172a',
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '14px',
        color: '#64748b'
      }}>
        {label}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: '28px',
          color: '#0f172a',
          margin: '0 0 8px 0'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Vue d'ensemble de votre gestion de stock
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <StatCard
          icon={Icons.products}
          value={stats?.total_products || 0}
          label="Total Produits"
          color="#3b7fff"
        />
        <StatCard
          icon={Icons.orders}
          value={stats?.pending_orders || 0}
          label="Commandes en attente"
          color="#8b5cf6"
        />
        <StatCard
          icon={Icons.revenue}
          value={formatCurrency(stats?.total_revenue)}
          label="Revenus totaux DH"
          color="#10b981"
        />
        <StatCard
          icon={Icons.alerts}
          value={stats?.low_stock_count || 0}
          label="Alertes stock bas"
          color="#f59e0b"
        />
      </div>

      {/* Chart Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            color: '#0f172a',
            margin: 0
          }}>
            Ventes & Revenus
          </h2>
          <button
            onClick={() => navigate('/stock-manager/commandes')}
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: '#3b7fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Voir détails {Icons.arrowRight}
          </button>
        </div>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                tick={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              />
              <Legend
                wrapperStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="revenus"
                name="Revenus (DH)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="ventes"
                name="Ventes"
                stroke="#3b7fff"
                strokeWidth={2}
                dot={{ fill: '#3b7fff', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* Recent Orders Panel */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
              margin: 0
            }}>
              Commandes récentes
            </h3>
            <button
              onClick={() => navigate('/stock-manager/commandes')}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#3b7fff',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Voir
            </button>
          </div>
          <div>
            {orders.length === 0 ? (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                Aucune commande récente
              </p>
            ) : (
              orders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < orders.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}>
                      #{order.id}
                    </div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {order.client_name}
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stock Alerts Panel */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15px',
              fontWeight: 600,
              color: '#0f172a',
              margin: 0
            }}>
              Alertes de Stock
            </h3>
            <button
              onClick={() => navigate('/stock-manager/alertes')}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#3b7fff',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Voir tout
            </button>
          </div>
          <div>
            {lowStockProducts.length === 0 ? (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                Aucune alerte de stock
              </p>
            ) : (
              lowStockProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < lowStockProducts.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}>
                      {product.name}
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: parseInt(product.quantity) === 0 ? '#fef2f2' : '#fff7ed',
                    color: parseInt(product.quantity) === 0 ? '#ef4444' : '#f59e0b',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '20px',
                    padding: '3px 10px'
                  }}>
                    {parseInt(product.quantity) === 0 ? 'Rupture' : 'Stock bas'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMDashboard;
