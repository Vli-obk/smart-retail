import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Inline SVG Icons
const Icons = {
  alert: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 7V10M10 13V14" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 8C3 5 5 3 10 3C15 3 17 5 17 8V13L19 15V16H1V15L3 13V8Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  spinner: (
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="none" stroke="#e2e8f0" strokeWidth="3"/>
      <circle cx="20" cy="20" r="16" fill="none" stroke="#3b7fff" strokeWidth="3" strokeLinecap="round" strokeDasharray="25 100">
        <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
};

const SMAlertes = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allProducts = response.data.data || [];
      // Filter for low stock
      const lowStock = allProducts.filter(p => 
        parseInt(p.quantity) <= parseInt(p.low_stock_threshold || 10)
      );
      setProducts(lowStock);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = (productId) => {
    // Navigate to products page with product ID to edit
    navigate(`/stock-manager/produits?edit=${productId}`);
  };

  const isOutOfStock = (product) => parseInt(product.quantity) === 0;

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
          Alertes de Stock
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Surveillez les produits avec des niveaux de stock critiques
        </p>
      </div>

      {/* Summary Bar */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {Icons.alert}
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#3b7fff'
        }}>
          <strong>{products.length}</strong> produit{products.length !== 1 ? 's' : ''} nécessite{products.length === 1 ? '' : 'nt'} une attention
        </span>
      </div>

      {/* Alert Cards Grid */}
      {products.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px',
            color: '#64748b'
          }}>
            Aucune alerte de stock active
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Top: Product Name + Category */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#0f172a',
                  margin: '0 0 4px 0'
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {product.category}
                </p>
              </div>

              {/* Middle: Stock Info */}
              <div style={{ marginBottom: '20px', flex: 1 }}>
                <div style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '32px',
                  color: isOutOfStock(product) ? '#ef4444' : '#f59e0b',
                  marginBottom: '4px'
                }}>
                  {product.quantity}
                </div>
                <p style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  color: '#64748b',
                  margin: 0
                }}>
                  / seuil: {product.low_stock_threshold || 10}
                </p>
              </div>

              {/* Bottom: Status Badge + Button */}
              <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: isOutOfStock(product) ? '#fef2f2' : '#fff7ed',
                  color: isOutOfStock(product) ? '#ef4444' : '#f59e0b',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  marginBottom: '12px'
                }}>
                  {isOutOfStock(product) ? 'Rupture' : 'Stock bas'}
                </span>
                <button
                  onClick={() => handleRestock(product.id)}
                  style={{
                    width: '100%',
                    backgroundColor: '#3b7fff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Réapprovisionner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SMAlertes;
