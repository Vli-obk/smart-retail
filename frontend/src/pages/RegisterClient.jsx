import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

const RegisterClient = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await api.post('users', formData);
            setStatus({ type: 'success', message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
            setFormData({ name: '', email: '', password: '' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: "Erreur lors de l'inscription. L'email est peut-être déjà utilisé." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="w-full max-w-md animate-fade-in text-center">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Devenir un Client</h1>
                <p className="text-slate-500 mb-8 font-medium">Rejoignez SmartRetail AI aujourd'hui</p>

                <div className="glass p-8 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border-white/40 backdrop-blur-2xl">
                    {status.message && (
                        <div className={`p-4 mb-6 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                            status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                            {status.type === 'success' && <CheckCircle2 size={18} />}
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Nom Complet</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Votre nom" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="votre@email.com" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary !py-4 flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {loading ? 'Création...' : "S'inscrire"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-slate-400 hover:text-blue-600 text-sm font-bold flex items-center gap-2 transition-colors duration-300 mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Déjà un compte ? Se connecter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterClient;
