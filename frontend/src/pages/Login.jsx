import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Kan-sefto l-data l-Laravel (8000)
            const response = await api.post('auth/login', formData);
            
           // Kan-khbiw l-user kamel bach n-3rfo l-role dyalo f l-sidebar
           localStorage.setItem('user', JSON.stringify(response.data.data.user)); 
           localStorage.setItem('token', response.data.data.token);
            
            // Ila daz l-login, kan-mchiw l-Dashboard
            navigate('/app/dashboard');
        } catch (err) {
            setError('Email wala Password ghalat. T2kd mn l-ma3loumat dyalk.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl w-96 border-t-4 border-blue-600">
                <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-600">Smart Retail</h2>
                <p className="text-gray-500 text-center mb-6 text-sm">Connectez-vous à votre espace Admin</p>
                
                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200 text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input 
                        type="email" 
                        placeholder="admin@example.com" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Mot de passe</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 shadow-md"
                >
                    Se Connecter
                </button>

                <div className="mt-6 text-center text-xs text-gray-400">
                    &copy; 2026 Smart Retail - Système de Gestion
                </div>
            </form>
        </div>
    );
};

export default Login;