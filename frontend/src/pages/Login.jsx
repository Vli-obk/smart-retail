import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2, Sparkles, UserCheck } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined') {
            navigate('/app/dashboard');
        }
    }, [navigate]);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('auth/login', formData);
            localStorage.setItem('user', JSON.stringify(response.data.data.user)); 
            localStorage.setItem('token', response.data.data.token);
            navigate('/app/dashboard');
        } catch (err) {
            setError('Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2 animate-pulse [animation-delay:1s]"></div>

            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Smart<span className="text-blue-600">Retail</span> AI</h1>
                    <p className="text-slate-500 font-medium">Accès sécurisé à votre tableau de bord</p>
                </div>

                <div className="glass p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border-white/40 ring-1 ring-black/5 backdrop-blur-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl animate-shake flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="admin@smartretail.com" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium" 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Mot de passe oublié ?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium" 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary !py-4 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authentification...
                                </>
                            ) : (
                                <>
                                    Se connecter au Tableau de Bord
                                    <Sparkles className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-sm font-medium text-slate-500">Êtes-vous un client ?</p>
                            <button 
                                onClick={() => navigate('/register')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors duration-300"
                            >
                                Créer un compte client
                            </button>
                        </div>
                        <button 
                            onClick={() => navigate('/')}
                            className="text-slate-400 hover:text-blue-600 text-sm font-bold flex items-center gap-2 transition-colors duration-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retourner à l'accueil
                        </button>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            &copy; 2026 Smart Retail AI - Enterprise Node
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;