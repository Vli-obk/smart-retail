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
  Activity,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  CheckCircle,
  Building,
  Headphones,
  Calendar,
  Users
} from 'lucide-react';
import api from '../services/api';
const heroImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";

const Home = () => {
    const navigate = useNavigate(); 
    
    // Contact Form Logic
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/contact', formData);
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error('Error sending contact form:', err);
            setIsSubmitting(false);
            alert('Erreur: ' + (err.response?.data?.message || 'Impossible d\'envoyer le message'));
        }
    };

    React.useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

            {/* About Section */}
            <section id="about" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] -z-0"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative animate-fade-in">
                            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 transform hover:rotate-0 transition-all duration-700 border-8 border-white group">
                                <img 
                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" 
                                    alt="Our Mission" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
                            </div>
                            {/* Decorative Badge */}
                            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">+12%</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Efficacité Accrue</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 animate-fade-in [animation-delay:200ms]">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-50 text-indigo-700 rounded-full font-black text-xs uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                Notre ADN Technologique
                            </div>
                            
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                                Redéfinir l'Expérience du <span className="text-indigo-600">Commerce de Détail</span>
                            </h2>
                            
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                SmartRetail n'est pas seulement un outil de gestion. C'est un écosystème intelligent conçu pour synchroniser chaque facette de votre entreprise en temps réel.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-slate-900">Vision Futuriste</h4>
                                        <p className="text-slate-500 leading-relaxed">Nous anticipons les tendances du marché avant qu'elles ne surviennent grâce à notre moteur prédictif propriétaire.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold text-slate-900">Approche Humaine</h4>
                                        <p className="text-slate-500 leading-relaxed">Notre plateforme simplifie les flux de travail complexes, permettant à votre personnel de se concentrer sur l'essentiel : le client.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-0 opacity-50"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-black text-xs uppercase tracking-widest">
                            <MessageSquare className="w-4 h-4" />
                            Prendre Contact
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Parlons de Votre Projet</h2>
                        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Info Column */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                Transformez votre commerce avec <span className="text-blue-600">SmartRetail</span>.
                            </h3>
                            <p className="text-lg text-slate-500 font-medium">
                                Nos experts sont là pour répondre à toutes vos questions sur l'intégration de l'IA dans votre point de vente.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                        <p className="font-bold text-slate-900">contact@smartretail.ma</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appel</p>
                                        <p className="font-bold text-slate-900">+212 522-123456</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Suivez l'Innovation</p>
                                <div className="flex gap-4">
                                    {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                        <button key={i} className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1">
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="bg-slate-50 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            {isSubmitted ? (
                                <div className="text-center py-12 space-y-6">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900">Message Envoyé !</h3>
                                        <p className="text-slate-500 font-medium">Nous vous contacterons dans les plus brefs délais.</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom Complet</label>
                                        <input 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            type="text" 
                                            placeholder="Jean Dupont"
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                        <input 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            type="email" 
                                            placeholder="jean@exemple.com"
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sujet</label>
                                        <select 
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                        >
                                            <option value="">Choisissez un sujet</option>
                                            <option value="demo">Demande de démo</option>
                                            <option value="support">Support Technique</option>
                                            <option value="partnership">Partenariat</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                            placeholder="Comment pouvons-nous vous aider ?"
                                            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 resize-none"
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}
                                    </button>
                                </form>
                            )}
                        </div>
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