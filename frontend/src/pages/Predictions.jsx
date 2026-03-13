import React, { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp } from 'lucide-react';

const Predictions = () => {
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8001/predict-sales')
            .then(res => res.json())
            .then(data => {
                setAiData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Python is not running");
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-8 ml-64 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BrainCircuit className="text-blue-600" /> AI Stock Predictor
            </h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                {loading ? (
                    <p>Analyse en cours...</p>
                ) : aiData?.status === "success" ? (
                    <div className="text-center">
                        <p className="text-slate-500 mb-2">Chiffre d'affaires prévu pour demain :</p>
                        <h2 className="text-5xl font-black text-blue-600 mb-4">{aiData.predicted_revenue} DH</h2>
                        <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-bold">
                            <TrendingUp size={16} /> Basé sur {aiData.days_analyzed} jours d'historique
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-slate-400">En attendant la prédiction</p>
                )}
            </div>
        </div>
    );
};

export default Predictions;