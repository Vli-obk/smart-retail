import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Zdt hadi bach t-ban l-bouton k-t-f-kker
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Envoi des données au backend Laravel
            const response = await api.post('auth/login', formData);
            
            // Stockage des informations de l'utilisateur et du token
            localStorage.setItem('user', JSON.stringify(response.data.data.user)); 
            localStorage.setItem('token', response.data.data.token);
            
            // Redirection vers le Dashboard en cas de succès
            navigate('/app/dashboard');
        } catch (err) {
            // --- HNA FIN BEDDELNA L-MESSAGE L L-FRANÇAIS ---
            setError('Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl w-96 border-t-4 border-blue-600">
                <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">Smart Retail AI</h2>
                <p className="text-gray-500 text-center mb-6 text-sm">Accès sécurisé à l'espace administration</p>
                
                {/* Message d'erreur en français */}
                {error && (
                    <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded border border-red-200 text-center animate-shake">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">Adresse Email</label>
                    <input 
                        type="email" 
                        placeholder="admin@smartretail.com" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">Mot de passe</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-3 rounded-lg font-bold transition duration-300 shadow-md uppercase`}
                >
                    {loading ? 'Connexion en cours...' : 'Se Connecter'}
                </button>

                <div className="mt-8 text-center border-t pt-4">
                    <button 
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-blue-600 text-xs font-semibold hover:underline"
                    >
                        &larr; Retour à l'accueil du site
                    </button>
                </div>

                <div className="mt-4 text-center text-[10px] text-gray-400 uppercase">
                    &copy; 2026 Smart Retail - Plateforme de Gestion IA
                </div>
            </form>
        </div>
    );
};

export default Login;