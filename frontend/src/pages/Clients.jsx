import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'stock_manager' // Default role for creation
    });

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            const resData = response.data.data || response.data;
            if (Array.isArray(resData)) {
                // Filter out current admin for better display
                setClients(resData.filter(u => u.role !== 'admin'));
            }
        } catch (err) {
            console.error("Erreur Fetch Clients:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await api.post('/users', formData);
            if (response.data.success || response.status === 201 || response.status === 200) {
                alert("Utilisateur créé avec succès !");
                setFormData({ name: '', email: '', password: '', role: 'stock_manager' });
                fetchClients(); 
            } else {
                alert("Erreur: " + (response.data.message || "Impossible de créer l'utilisateur"));
            }
        } catch (err) {
            console.error("Erreur Ajout:", err);
            const errMsg = err.response?.data?.message || err.message || "Erreur de connexion";
            alert("Erreur lors de l'enregistrement: " + errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Architecture du Personnel
                    </h1>
                    <p className="text-slate-500 font-medium">Gérez les gestionnaires de stock et les permissions d'infrastructure.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchClients}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin text-blue-500' : 'text-slate-400'} />
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Annuaire Actif</span>
                    </div>
                </div>
            </div>

            {/* Registration Form Card */}
            <div className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border-white/40 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Provisionner un Nouveau Gestionnaire</h2>
                </div>

                <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    <div className="md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Nom Complet</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                <User size={16} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Nom du gestionnaire" 
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 text-sm" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Noeud Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                <Mail size={16} />
                            </div>
                            <input 
                                type="email" 
                                placeholder="manager@smartretail.com" 
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 text-sm" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Clé de Sécurité</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                <Lock size={16} />
                            </div>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 text-sm" 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="w-full bg-blue-600 text-white px-6 h-[46px] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {submitting ? 'Traitement...' : 'Provisionner le Compte'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table of Users */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-72 group">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Search size={16} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Rechercher dans l'annuaire..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-xs font-bold"
                            />
                        </div>
                        <button className="p-2.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                            <Filter size={16} />
                        </button>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Directory</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-bold text-slate-600">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identité du Gestionnaire</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Noeud de Contact</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Etat d'Accès</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Opérations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <tr key={i} className="animate-pulse px-8">
                                        <td colSpan="4" className="p-8"><div className="h-10 bg-slate-50 rounded-2xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : Array.isArray(clients) && clients.length > 0 ? 
                                clients.map(u => (
                                    <tr key={u.id} className="group hover:bg-blue-50/20 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all group-hover:text-blue-500 ring-1 ring-slate-200/50">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm leading-none">{u.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{u.role || 'Staff'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-semibold text-slate-500">{u.email}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {u.status === 'active' || u.status === 'accepté' ? (
                                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1.5 border border-emerald-100">
                                                        <CheckCircle2 size={12} strokeWidth={3} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Actif</span>
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full flex items-center gap-1.5 border border-amber-100">
                                                        <Clock size={12} strokeWidth={3} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Inactif</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                         <td colSpan="4" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                <ShieldCheck size={48} />
                                                <p className="font-bold">Aucun gestionnaire externe trouvé</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-6 bg-slate-50/50 flex items-center justify-between">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Smart Retail Governance Node v1.0.2</p>
                </div>
            </div>
        </div>
    );
};

export default Clients;