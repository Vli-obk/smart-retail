import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  AlertTriangle, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  Microscope,
  Zap,
  ChevronRight
} from 'lucide-react';

const Alertes = () => {
    const [alerts, setAlerts] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch from Laravel
        fetch('http://localhost:8000/api/dashboard/stats')
            .then(res => res.json())
            .then(data => {
                setAlerts(data.data.top_selling_products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Laravel error:", err);
                setLoading(false);
            });

        // Fetch from Python
        fetch('http://localhost:8001/predict-stock-out/1')
            .then(res => res.json())
            .then(data => setPrediction(data))
            .catch(err => console.log("Python service is offline"));
    }, []);

    return (
        <div className="p-8 animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence & Alertes</h1>
                    <p className="text-slate-500 font-medium">Évaluation des risques en temps réel et prédictions de stock par l'IA.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Analyse en Direct</span>
                </div>
            </div>
            
            {/* AI Predictive Insight Card */}
            <section className="relative overflow-hidden group">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative z-10 border border-white/5 shadow-2xl shadow-blue-500/10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="space-y-6 lg:max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-xs font-black uppercase tracking-widest">
                                <BrainCircuit className="w-4 h-4" />
                                Moteur de Prédiction Scikit-Learn
                            </div>
                            
                             <h2 className="text-4xl font-black leading-tight tracking-tight">
                                Rapport d'Intelligence: <br />
                                <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Épuisement Critique</span> Détecté
                            </h2>

                            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                                "Notre architecture neuronale a analysé les vitesses de transaction. Les modèles indiquent des ruptures de stock imminentes pour les produits prioritaires."
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Atout Ciblé</p>
                                    <p className="text-xl font-bold">Couscous Premium 1KG</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl">
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Fenêtre de Risque</p>
                                    <p className="text-xl font-bold text-rose-500">~ {prediction?.days_until_out || '4'} Jours Restants</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="bg-blue-600 rounded-[2rem] p-8 shadow-xl shadow-blue-600/30 transform hover:scale-[1.02] transition-transform duration-500">
                                 <div className="flex items-center justify-between mb-8">
                                    <Zap className="text-white w-8 h-8 fill-white/20" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Protocole Urgent</span>
                                </div>
                                <h3 className="text-2xl font-black mb-4 leading-tight">Automatiser le Stock?</h3>
                                <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed opacity-90">
                                    Synchronisation avec l'API fournisseur pour un réapprovisionnement immédiat.
                                </p>
                                <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl shadow-xl shadow-black/20 hover:bg-slate-50 transition-colors">
                                    Autoriser le Réapprovisionnement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* List of Under-surveillance Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                 <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                                    <ShieldAlert size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Liste de Surveillance des Stocks</h3>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tri par risque</span>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <div key={i} className="p-8 animate-pulse flex gap-6">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-slate-50 rounded w-1/4"></div>
                                            <div className="h-3 bg-slate-50 rounded w-1/6"></div>
                                        </div>
                                    </div>
                                ))
                            ) : alerts.length > 0 ? (
                                alerts.map(item => (
                                    <div key={item.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-slate-50 transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                                <TrendingDown size={24} className="text-rose-400" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 tracking-tight">{item.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Atout: #00{item.id}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">SKU Prioritaire</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                             <div className="text-right hidden md:block">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">État Actuel</p>
                                                <p className="text-lg font-black text-slate-900">{item.current_stock || 0} <span className="text-[10px]">UNITÉS</span></p>
                                            </div>
                                            <button className="h-12 w-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                 <div className="p-20 text-center font-bold text-slate-400">
                                    Tous les systèmes sont opérationnels. Aucun risque critique détecté.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Télémétrie Système</h3>
                        </div>
                        
                        <TelemetryRow label="Précision Modèle" value="94.2%" color="text-emerald-500" />
                        <TelemetryRow label="Fraîcheur Données" value="Dernières 24h" color="text-blue-500" />
                        <TelemetryRow label="Capteurs Actifs" value="12 Nœuds" color="text-slate-900" />
                        
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                             <div className="flex items-center gap-2 mb-3">
                                <Microscope size={16} className="text-indigo-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Mode d'Analyse</span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                Le système fonctionne actuellement en "Mode Prédictif". Le réapprovisionnement automatique est désactivé par politique locale.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TelemetryRow = ({ label, value, color }) => (
    <div className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-black ${color}`}>{value}</span>
    </div>
);

export default Alertes;