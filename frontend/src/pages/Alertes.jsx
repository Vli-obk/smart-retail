import React, { useState, useEffect } from 'react';

const Alertes = () => {
    const [alerts, setAlerts] = useState([]);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        // 1. Fetch men Laravel
        fetch('http://localhost:8000/api/dashboard/stats') // n-khdmo b hada hit fih data
            .then(res => res.json())
            .then(data => setAlerts(data.data.top_selling_products || []));

        // 2. Fetch men Python
        fetch('http://localhost:8001/predict-stock-out/1')
            .then(res => res.json())
            .then(data => setPrediction(data))
            .catch(err => console.log("Python error:", err));
    }, []);

    return (
        <div className="p-8 ml-64 min-h-screen bg-gray-50"> {/* ml-64 bach t-b3ed 3la sidebar */}
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Alertes de Stock & IA</h1>
            
            {/* Affichage dyal l-IA (Python) */}
            {prediction && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🤖</span>
                        <h2 className="text-xl font-semibold">Analyse Prédictive de l'IA</h2>
                    </div>
                    <p className="text-blue-50">
                        Basé sur l'historique des ventes, le produit 
                        <span className="font-bold text-white"> Kouskso </span> 
                        sera en rupture de stock dans environ 
                        <span className="bg-yellow-400 text-blue-900 px-2 py-1 rounded ml-2 font-black">
                            {prediction.days_until_out} jours
                        </span>.
                    </p>
                </div>
            )}

            {/* Lista dyal l-Alertes (Laravel) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700">Produits sous surveillance</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {alerts.map(item => (
                        <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">ID: #{item.id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                                    Stock: {item.current_stock || 0}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Alertes;