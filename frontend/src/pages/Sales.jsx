import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShoppingCart, 
  History, 
  PlusCircle, 
  Receipt, 
  CreditCard, 
  Package, 
  ArrowUpRight,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Sales = () => {
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]); 
    const [formData, setFormData] = useState({ product_id: '', quantity: 1 });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [prodRes, salesRes] = await Promise.all([
                api.get('products'),
                api.get('sales')
            ]);
            setProducts(prodRes.data.data);
            setSales(salesRes.data.data);
        } catch (err) { 
            console.error("Erreur de chargement"); 
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            await api.post('sales', formData);
            setMessage({ type: 'success', text: 'Transaction completed successfully!' });
            setFormData({ product_id: '', quantity: 1 });
            fetchInitialData(); 
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Transaction failed.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Point de Vente</h1>
                <p className="text-slate-500 font-medium">Enregistrez de nouvelles transactions et surveillez les flux de revenus historiques.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 1. Transaction Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border-white/50 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                <PlusCircle size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Nouvelle Commande</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Sélectionner un Atout</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Package size={18} />
                                    </div>
                                    <select 
                                        className="w-full pl-11 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 appearance-none"
                                        value={formData.product_id}
                                        onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Choisir un produit...</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.stock} en stock)</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Quantité</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <ArrowUpRight size={18} />
                                    </div>
                                    <input 
                                        type="number" min="1"
                                        placeholder="1"
                                        className="w-full pl-11 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    disabled={submitting}
                                    className="w-full btn-primary !py-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Receipt size={20} />
                                            Encaisser la vente
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {message && (
                            <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between group overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Hub de Paiement</p>
                            <p className="font-bold text-sm">Nœud Marchand Sécurisé</p>
                         </div>
                         <CreditCard className="text-blue-500 w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* 2. Transaction History */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
                                <History size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Historique des Transactions</h2>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{sales.length} Enregistrements Actifs</span>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/30">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Atout de Transaction</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Volume</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Valeur Totale</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Horodatage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                     [1,2,3,4,5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="4" className="px-8 py-6"><div className="h-6 bg-slate-50 rounded-lg w-full"></div></td>
                                        </tr>
                                     ))
                                ) : sales.length > 0 ? (
                                    sales.map(s => (
                                        <tr key={s.id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                                    <span className="font-bold text-slate-900">{s.product?.name || 'Asset Item'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-bold text-slate-500">{s.quantity}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="px-3 py-1 bg-blue-50 rounded-lg inline-block">
                                                    <span className="text-blue-600 font-black text-sm">{s.total_price?.toLocaleString()} <span className="text-[10px] opacity-70">DH</span></span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-slate-300" />
                                                         {new Date(s.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Vérifié</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center text-slate-400 font-medium italic">
                                            Aucune transaction récente observée dans l'historique.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;