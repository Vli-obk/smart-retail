import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, History, Package, PlusCircle } from 'lucide-react';

const Sales = () => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]); // Historique
    const [formData, setFormData] = useState({ product_id: '', quantity: 1 });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [prodRes, salesRes] = await Promise.all([
                api.get('products'),
                api.get('sales') // Khass l-backend i-kon 3ndou index f SaleController
            ]);
            setProducts(prodRes.data.data);
            setSales(salesRes.data.data);
        } catch (err) { console.error("Erreur de chargement"); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('sales', formData);
            setMessage('Vente réussie !');
            setFormData({ product_id: '', quantity: 1 });
            fetchInitialData(); // Recharger kolchi bach l-stock t-n9ess f l-lista
        } catch (err) {
            setMessage(err.response?.data?.message || 'Erreur');
        }
    };

    return (
        <div className="p-8 ml-64 bg-slate-50 min-h-screen font-sans">
            <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <ShoppingCart className="text-blue-600" /> Gestion des Ventes
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Formulaire (Partie Sghira) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <PlusCircle size={20} className="text-green-500" /> Nouveau Ticket
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Article</label>
                            <select 
                                className="w-full p-2 border rounded-lg"
                                value={formData.product_id}
                                onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                                required
                            >
                                <option value="">Choisir...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.stock} dispo)</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantité</label>
                            <input 
                                type="number" min="1"
                                className="w-full p-2 border rounded-lg"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                required
                            />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                            Vendre
                        </button>
                    </form>
                    {message && <p className="mt-4 text-sm text-blue-600 font-bold">{message}</p>}
                </div>

                {/* 2. Historique (Partie Kbira) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <History size={20} className="text-slate-400" /> Dernières Transactions
                    </h2>
                    <table className="w-full text-left">
                        <thead className="text-slate-500 border-b">
                            <tr>
                                <th className="p-3 font-semibold">Produit</th>
                                <th className="p-3 font-semibold">Qté</th>
                                <th className="p-3 font-semibold">Total</th>
                                <th className="p-3 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(s => (
                                <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="p-3 font-medium">{s.product?.name || 'Produit'}</td>
                                    <td className="p-3">{s.quantity}</td>
                                    <td className="p-3 font-bold text-blue-600">{s.total_price} DH</td>
                                    <td className="p-3 text-xs text-slate-400">{new Date(s.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Sales;