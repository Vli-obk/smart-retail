import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Inline SVG Icons
const Icons = {
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="8" stroke="#3b7fff" strokeWidth="1.5"/>
      <path d="M10 6V7M10 9V14" stroke="#3b7fff" strokeWidth="1.5" strokeLinecap="round"/>
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

const SMPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/predictions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPredictions(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationBadge = (recommendation) => {
    const isRestock = recommendation === 'restock' || recommendation === 'reorder';
    return (
      <span style={{
        backgroundColor: isRestock ? '#fef2f2' : '#f0fdf4',
        color: isRestock ? '#ef4444' : '#10b981',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '20px',
        padding: '3px 10px'
      }}>
        {isRestock ? 'Réapprovisionner' : 'OK'}
      </span>
    );
  };

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
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: '28px',
          color: '#0f172a',
          margin: '0 0 8px 0'
        }}>
          Prédictions IA
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Demande prévue sur 7 jours
        </p>
      </div>

      {/* Info Banner */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #dbeafe',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {Icons.info}
        <span style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#3b7fff'
        }}>
          Les prédictions sont générées par le modèle ML Random Forest
        </span>
      </div>

      {/* Predictions Table */}
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
              }}>Produit</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Stock actuel</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Demande prévue (7j)</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Recommandation</th>
            </tr>
          </thead>
          <tbody>
            {predictions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{
                  padding: '40px',
                  textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Aucune prédiction disponible
                </td>
              </tr>
            ) : (
              predictions.map((prediction, index) => (
                <tr
                  key={prediction.id || index}
                  style={{
                    borderBottom: index < predictions.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a'
                  }}>{prediction.product_name}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}>{prediction.current_stock}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#3b7fff'
                  }}>{prediction.predicted_demand_7d}</td>
                  <td style={{
                    padding: '14px 16px'
                  }}>
                    {getRecommendationBadge(prediction.recommendation)}
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

export default SMPredictions;
