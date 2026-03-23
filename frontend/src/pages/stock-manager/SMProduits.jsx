import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Inline SVG Icons
const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="#64748b" strokeWidth="1.5"/>
      <path d="M13 13L16 16" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  edit: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4L12 8L5 15H2V12L8 4Z" stroke="#3b7fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M12 4V13C12 14 11 15 10 15H6C5 15 4 14 4 13V4M6 4V3C6 2 6 2 8 2H9C10 2 11 2 11 3V4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5L15 15M15 5L5 15" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
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

const SMProduits = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    low_stock_threshold: '10'
  });

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
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: '', quantity: '', price: '', low_stock_threshold: '10' });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      low_stock_threshold: product.low_stock_threshold || '10'
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setDeleteConfirm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const data = {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        low_stock_threshold: parseInt(formData.low_stock_threshold)
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data, { headers });
      } else {
        await axios.post('/api/products', data, { headers });
      }

      closeModal();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLowStock = (product) => 
    parseInt(product.quantity) <= parseInt(product.low_stock_threshold || 10);

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
          Produits
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          margin: 0
        }}>
          Gérez votre catalogue de produits et les niveaux de stock
        </p>
      </div>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 14px',
          width: '300px'
        }}>
          {Icons.search}
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              color: '#0f172a',
              width: '100%',
              background: 'transparent'
            }}
          />
        </div>

        {/* Add Button */}
        <button
          onClick={openAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#3b7fff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 18px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {Icons.plus}
          Ajouter un produit
        </button>
      </div>

      {/* Products Table */}
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
              }}>Catégorie</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Stock</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Prix unitaire</th>
              <th style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: '14px 16px'
              }}>Seuil alerte</th>
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{
                  padding: '40px',
                  textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: index < filteredProducts.length - 1 ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}>{product.name}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>{product.category}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isLowStock(product) ? '#ef4444' : '#0f172a'
                  }}>{product.quantity}</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}>{parseFloat(product.price).toFixed(2)} DH</td>
                  <td style={{
                    padding: '14px 16px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>{product.low_stock_threshold || 10}</td>
                  <td style={{
                    padding: '14px 16px',
                    textAlign: 'center'
                  }}>
                    {deleteConfirm === product.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#64748b',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => openEditModal(product)}
                          style={{
                            backgroundColor: '#eff6ff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Modifier"
                        >
                          {Icons.edit}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
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
                          title="Supprimer"
                        >
                          {Icons.trash}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                color: '#0f172a',
                margin: 0
              }}>
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {Icons.close}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#0f172a',
                  marginBottom: '6px'
                }}>
                  Nom du produit
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#0f172a',
                  marginBottom: '6px'
                }}>
                  Catégorie
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#0f172a',
                    marginBottom: '6px'
                  }}>
                    Quantité
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{
                      width: '100%',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#0f172a',
                    marginBottom: '6px'
                  }}>
                    Prix unitaire (DH)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '14px',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#0f172a',
                  marginBottom: '6px'
                }}>
                  Seuil d'alerte
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#3b7fff',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {editingProduct ? 'Sauvegarder' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMProduits;
