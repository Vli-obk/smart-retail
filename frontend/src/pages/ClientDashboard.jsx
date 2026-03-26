import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Gift, 
  MessageSquare,
  Search,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const ClientDashboard = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const response = await api.get('/orders'); 
            // The backend should filter orders by the logged-in user if it's a client
            const orderData = response.data.data || response.data;
            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch (err) {
            console.error("Error fetching client orders:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        pending: { label: 'En attente', color: 'bg-amber-50 text-amber-600 ring-amber-100', icon: <Clock size={14}/> },
        approved: { label: 'Validée', color: 'bg-emerald-50 text-emerald-600 ring-emerald-100', icon: <CheckCircle size={14}/> },
        rejected: { label: 'Rejetée', color: 'bg-rose-50 text-rose-600 ring-rose-100', icon: <Package size={14}/> },
        delivered: { label: 'Livrée', color: 'bg-blue-50 text-blue-600 ring-blue-100', icon: <Package size={14}/> },
    };

    return (
        <div className="p-8 space-y-10 animate-fade-in">
            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Bonjour, <span className="text-blue-600">{user?.name || 'Client'}</span> 👋
                    </h1>
                    <p className="text-slate-500 font-medium italic">Bienvenue dans votre espace personnel SmartRetail.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Statut Membre</p>
                            <p className="text-sm font-black text-slate-900">VIP Digital Atout</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/40 transition-colors"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight leading-none">Nouvelle Commande</h2>
                            <p className="text-slate-400 text-sm font-medium">Explorez notre catalogue d'atouts numériques intelligents.</p>
                        </div>
                        <button className="mt-8 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2 group">
                            Commander Maintenant
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                            <Gift className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Points Fidelité</h2>
                        <p className="text-slate-500 text-sm font-medium">Vous avez <span className="text-emerald-600 font-black">2,450 Points</span> accumulés.</p>
                    </div>
                    <button className="mt-8 py-3 bg-slate-50 text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-colors text-sm border border-slate-100">
                        Voir les Récompenses
                    </button>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Support Dédié</h2>
                        <p className="text-slate-500 text-sm font-medium">Une question ? Notre équipe est disponible 24/7 pour vous.</p>
                    </div>
                    <button className="mt-8 py-3 bg-slate-50 text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-colors text-sm border border-slate-100">
                        Discuter avec l'IA
                    </button>
                </div>
            </div>

            {/* Order History Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Historique des Commandes</h2>
                    </div>
                    <div className="relative isolate">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="N° Commande..." 
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-xs w-48"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic">Référence</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic">Horodatage</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic">Statut Commande</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic">Montant Total</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest italic text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-8"><div className="h-10 bg-slate-50 rounded-2xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : orders.length > 0 ? (
                                orders.map((order) => {
                                    const config = statusConfig[order.status] || statusConfig.pending;
                                    return (
                                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900 text-sm">#SR-{order.id.toString().padStart(4, '0')}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-600">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{new Date(order.created_at).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ring-1 ${config.color}`}>
                                                    {config.icon}
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900">{order.total_amount?.toLocaleString()} <span className="text-[10px] text-slate-400 italic">DH</span></p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="space-y-4 opacity-30 group">
                                            <ShoppingBag className="w-12 h-12 mx-auto text-slate-200 group-hover:scale-110 transition-transform" />
                                            <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Aucune commande pour le moment</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
