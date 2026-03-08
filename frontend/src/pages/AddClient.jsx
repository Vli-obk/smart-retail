import React, { useState } from 'react';
import api from '../services/api';

const AddClient = () => {
    const [clientData, setClientData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('users', clientData);
            setMessage("Le client a été ajouté avec succès !");
            setClientData({ name: '', email: '', password: '' }); // Khwi l-formulaire
        } catch (error) {
            setMessage("Erreur : Impossible d'ajouter le client.");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Ajouter un nouveau Gérant</h2>
            {message && <p className="mb-4 p-2 bg-blue-50 text-blue-600 rounded">{message}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Nom complet</label>
                    <input type="text" className="w-full border p-2 rounded" value={clientData.name}
                        onChange={(e) => setClientData({...clientData, name: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input type="email" className="w-full border p-2 rounded" value={clientData.email}
                        onChange={(e) => setClientData({...clientData, email: e.target.value})} required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Mot de passe</label>
                    <input type="password" className="w-full border p-2 rounded" value={clientData.password}
                        onChange={(e) => setClientData({...clientData, password: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    Créer le compte Client
                </button>
            </form>
        </div>
    );
};

export default AddClient;