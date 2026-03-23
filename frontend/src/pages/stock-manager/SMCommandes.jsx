import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Inline SVG Icons
const Icons = {
  check: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L7 12L13 4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L12 12M12 4L4 12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
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
  statusDot: (color) => (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="4" fill={color}/>
    </svg>
  )
};

const SMCommandes = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      const response = await axios.get(`/api/orders${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${orderId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${orderId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const formatCurrency = (value) => {
    return value ? `${parseFloat(value).toFixed(2)} DH` : '0.00 DH';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  const filterTabs = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En attente' },
    { key: 'approved', label: 'Approuvées' },
    { key: 'rejected', label: 'Rejetées' }
  ];

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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: '28px',
          color: '#0f172a',
          margin: '0 0 8px 0'
        }}>
          Commandes
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Gérez les commandes clients et leurs approbations
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px'
      }}>
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeFilter === tab.key ? '2px solid #3b7fff' : '2px solid transparent',
              color: activeFilter === tab.key ? '#3b7fff' : '#64748b',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>N° Commande</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Client</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Produits</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Total</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Date</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Statut</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'center',
                padding: '14px 16px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{
                  padding: '40px',
                  textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: index < orders.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}>#{order.id}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}>{order.client_name}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    {order.order_items?.map(item => item.product_name).join(', ') || '-'}
                  </td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}>{formatCurrency(order.total_amount)}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>{formatDate(order.created_at)}</td>
                  <td style={{
                    padding: '14px 16px'
                  }}>{getStatusBadge(order.status)}</td>
                  <td style={{
                    padding: '14px 16px',
                    textAlign: 'center'
                  }}>
                    {order.status === 'pending' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleApprove(order.id)}
                          style={{
                            backgroundColor: '#f0fdf4',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Approuver"
                        >
                          {Icons.check}
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          style={{
                            backgroundColor: '#fef2f2',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Rejeter"
                        >
                          {Icons.x}
                        </button>
                      </div>
                    ) : (
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '14px',
                        color: '#94a3b8'
                      }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SMCommandes;
