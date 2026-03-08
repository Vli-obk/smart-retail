import React, { useState, useEffect } from 'react';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const fetchClients = () => {
        setLoading(true);
        fetch('http://localhost:8000/api/users')
            .then(res => res.json())
            .then(resData => {
                if (resData && Array.isArray(resData.data)) {
                    setClients(resData.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur Fetch:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                // Message en Français
                alert("Demande envoyée avec succès ! Le compte est en attente d'activation.");
                setFormData({ name: '', email: '', password: '' });
                fetchClients(); 
            } else {
                // Message d'erreur en Français
                alert("Erreur lors de l'inscription : " + (data.message || "Données invalides"));
            }
        })
        .catch(err => {
            console.error("Erreur Ajout:", err);
            alert("Impossible de contacter le serveur.");
        });
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="text-blue-600">🛡️</span> Gestion de Stock Manager
            </h1>

            {/* Formulaire - Nouvelle Inscription */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-blue-600 font-medium">👤+ Ajouter un nouveau gestionnaire de stock</h2>
                <form onSubmit={handleAddClient} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Nom Complet</label>
                        <input type="text" placeholder="Ex: Jean Dupont" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Adresse Email</label>
                        <input type="email" placeholder="manager@smartretail.com" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Mot de passe</label>
                        <input type="password" placeholder="••••••••" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md uppercase text-sm">
                        Envoyer Demande
                    </button>
                </form>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Nom de l'utilisateur</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Statut d'accès</th>
                            <th className="p-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="4" className="p-10 text-center text-gray-400">Chargement des données...</td></tr>
                        ) : Array.isArray(clients) && clients.length > 0 ? 
                            clients
                            .filter(user => user.role !== 'admin') 
                            .map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                                            user.status === 'accepté' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {user.status === 'accepté' ? 'Validé' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.status !== 'accepté' ? (
                                            <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-xs font-bold hover:bg-green-700 transition shadow-sm uppercase tracking-wide">
                                                Approuver
                                            </button>
                                        ) : (
                                            <span className="text-green-500 text-xs font-bold italic">Accès Autorisé</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="p-10 text-center text-gray-400">Aucun gestionnaire de stock enregistré.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;