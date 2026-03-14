import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
  Upload,
  CheckCircle,
  LogOut
} from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        avatar: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setProfileForm({
                name: parsedUser.name || '',
                email: parsedUser.email || '',
                avatar: parsedUser.avatar || ''
            });
        }
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await api.put('/user/profile', profileForm);
            
            if (response.data) {
                // Update localStorage
                const updatedUser = { ...user, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSuccessMessage('Profile updated successfully!');
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getBackPath = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role === 'stock_manager') {
                return '/app/stock-manager';
            }
        }
        return '/app/dashboard';
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            setErrorMessage('New passwords do not match');
            return;
        }

        if (passwordForm.new_password.length < 6) {
            setErrorMessage('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await api.put('/user/password', {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password
            });
            
            if (response.data) {
                setSuccessMessage('Password changed successfully!');
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you'd upload to server
            // For now, just use a placeholder
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileForm({ ...profileForm, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(getBackPath())}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                        <p className="text-gray-600 mt-1">Gérez votre profil et vos préférences</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Profil
                        </h2>
                        
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {profileForm.avatar ? (
                                        <img src={profileForm.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0)?.toUpperCase() || 'U'
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                    <Camera className="w-4 h-4" />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Cliquez pour changer l'image</p>
                        </div>

                        {/* Profile Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                <input 
                                    type="text" 
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button 
                                onClick={handleProfileUpdate}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-blue-600" />
                            Sécurité
                        </h2>
                        
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={passwordForm.current_password}
                                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordForm.new_password}
                                            onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordForm.confirm_password}
                                            onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Exigences de mot de passe:</strong>
                                </p>
                                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                                    <li>• Au moins 6 caractères</li>
                                    <li>• Contient des lettres et des chiffres</li>
                                    <li>• Les mots de passe doivent correspondre</li>
                                </ul>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Lock className="w-4 h-4" />
                                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
