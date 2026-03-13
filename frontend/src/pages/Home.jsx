import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  BrainCircuit,
  ShoppingBag,
  Activity
} from 'lucide-react';
const heroImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";

const Home = () => {
    const navigate = useNavigate(); // Initialized useNavigate
    return (
        <div className="min-h-screen hero-gradient flex flex-col pt-20">
            <Navbar />
            
            {/* Hero Section */}
            <section className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-12 lg:py-24 gap-12 max-w-7xl mx-auto w-full">
                <div className="lg:w-1/2 space-y-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-xs uppercase tracking-[0.2em] animate-fade-in">
                        <Sparkles className="w-4 h-4" />
                        Vente de Nouvelle Génération
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                        Plateforme de Vente <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Intelligente</span> Propulsée par l'IA
                    </h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Transformez votre architecture commerciale avec nos nœuds d'inventaire neuronaux et nos analyses prédictives en temps réel.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <button onClick={() => navigate('/app/dashboard')} className="btn-primary !px-8 !py-4 text-lg flex items-center gap-2 group">
                            Explorer les Analyses
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl border-2 border-slate-100 hover:border-blue-600 transition-all text-lg shadow-sm">
                            Commencer
                        </button>
                    </div>
                </div>

                <div className="lg:w-1/2 relative animate-fade-in [animation-delay:200ms]">
                    <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 transform hover:-rotate-1 transition-transform duration-500 border-8 border-white/50 backdrop-blur">
                        <img 
                            src={heroImageUrl} 
                            alt="Smart Retail Dashboard" 
                            className="w-full h-auto"
                        />
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl -z-10"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fonctionnalités Puissantes</h2>
                        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Package className="w-8 h-8" />} 
                            title="Gestion des Stocks" 
                            desc="Contrôlez chaque produit avec une précision chirurgicale en temps réel." 
                        />
                        <FeatureCard 
                            icon={<BrainCircuit className="w-8 h-8" />} 
                            title="Prédictions IA" 
                            desc="Réseaux neuronaux avancés pour prévenir les ruptures de stock." 
                        />
                        <FeatureCard 
                            icon={<ShoppingBag className="w-8 h-8" />} 
                            title="Analyses de Ventes" 
                            desc="Visualisez vos flux de revenus avec des rapports de performance haute fidélité." 
                        />
                    </div>
                </div>
            </section>

            {/* Footer / CTA Section */}
            <section className="py-24 px-6 bg-slate-900 mt-auto">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl font-bold text-white">Ready to transform your retail business?</h2>
                    <p className="text-slate-400 text-lg">Join the future of smart commerce today.</p>
                    <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-blue-700 transition-all inline-block shadow-lg shadow-blue-500/30">
                        Login
                    </Link>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-10 rounded-3xl bg-slate-50 hover:bg-white border-2 border-transparent hover:border-blue-100 transition-all group">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
);

export default Home;