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
                alert("Demande envoyée ! Le compte est en attente d'activation.");
                setFormData({ name: '', email: '', password: '' });
                fetchClients(); 
            } else {
                alert("Erreur: " + data.message);
            }
        })
        .catch(err => console.error("Erreur Ajout:", err));
    };

    return (
        <div className="p-8 ml-64 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span className="text-blue-600">🛡️</span> Gestion des Clients
            </h1>

            {/* Formulaire - L-blassa fin k-t-creyi l-compte bach t-testi */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 text-green-600">👤+ Nouvelle Inscription (Test Client)</h2>
                <form onSubmit={handleAddClient} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Nom Complet</label>
                        <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Email</label>
                        <input type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1">Mot de passe</label>
                        <input type="password" placeholder="••••••••" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                        Envoyer Demande
                    </button>
                </form>
            </div>

            {/* Tableau - Hna fin ghadi i-banou ghir les clients */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4 border-b">Nom</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Array.isArray(clients) && clients.length > 0 ? 
                            clients
                            // 1. Kan-filitriw bach l-Admin may-ban-ch f had l-lista dyal l-validation
                            .filter(user => user.role !== 'admin') 
                            .map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            user.status === 'en attente' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {user.status || 'en attente'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {/* L-bouton dyal l-Admin bach i-valider */}
                                        {user.status !== 'accepté' && (
                                            <button className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600 transition">
                                                Accepter
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="p-4 text-center text-gray-400">Aucun client trouvé.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;