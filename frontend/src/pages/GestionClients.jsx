import React, { useState, useEffect } from 'react';

const GestionClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch l-users men l-API li t-7ellat
        fetch('http://localhost:8000/api/users')
            .then(res => res.json())
            .then(resData => {
                // T2kdna ana l-data jaya f west resData.data
                if (resData && Array.isArray(resData.data)) {
                    setClients(resData.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur fetch:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 ml-64 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Clients</h1>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4 border-b">Nom</th>
                            <th className="p-4 border-b">Email</th>
                            <th className="p-4 border-b">Rôle</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clients.length > 0 ? clients.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{user.name}</td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4 text-sm font-bold text-blue-600">
                                    {user.role}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="p-10 text-center text-gray-400">
                                    {loading ? "Chargement des données..." : "Aucun client trouvé."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// DAROURI HAD L-STER BACH MAT-BIYAADCH L-PAGE
export default GestionClients;