import React from 'react';
import Navbar from '../components/Navbar';
import { 
  Package, 
  BrainCircuit, 
  ShoppingBag, 
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Cpu,
  Database,
  Globe,
  Lock,
  RefreshCw,
  Target,
  PieChart
} from 'lucide-react';

const Features = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-16 px-6 lg:px-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="space-y-8 animate-fade-in">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-bold text-sm uppercase tracking-wider border border-blue-200 shadow-lg">
                            <Star className="w-5 h-5 text-blue-600" />
                            Fonctionnalités Premium
                        </div>
                        
                        <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight">
                            Des Outils <span className="text-blue-600">Puissants</span> pour Votre Business
                        </h1>
                        
                        <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto">
                            Découvrez notre suite complète d'outils intelligents conçus pour transformer votre entreprise en une machine de vente performante.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-24 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Package className="w-8 h-8" />}
                            title="Gestion des Stocks"
                            description="Suivi en temps réel de votre inventaire avec alertes automatiques de réapprovisionnement."
                            features={["Inventaire temps réel", "Alertes de stock bas", "Prévisions IA"]}
                            color="blue"
                        />
                        <FeatureCard 
                            icon={<BrainCircuit className="w-8 h-8" />}
                            title="IA Prédictive"
                            description="Algorithmes avancés pour anticiper les tendances du marché et optimiser vos stocks."
                            features={["Prédictions précises", "Apprentissage continu", "Optimisation auto"]}
                            color="purple"
                        />
                        <FeatureCard 
                            icon={<ShoppingBag className="w-8 h-8" />}
                            title="Analytics Avancées"
                            description="Tableaux de bord interactifs avec des KPIs personnalisés et rapports détaillés."
                            features={["Dashboard temps réel", "Rapports personnalisés", "KPIs sur mesure"]}
                            color="green"
                        />
                        <FeatureCard 
                            icon={<Users className="w-8 h-8" />}
                            title="CRM Intégré"
                            description="Gérez vos clients avec un système CRM puissant et entièrement intégré."
                            features={["Profils clients", "Historique d'achats", "Segmentation auto"]}
                            color="orange"
                        />
                        <FeatureCard 
                            icon={<ShieldCheck className="w-8 h-8" />}
                            title="Sécurité Maximale"
                            description="Protection de vos données avec cryptage de niveau militaire et sauvegardes automatiques."
                            features={["Cryptage AES-256", "Sauvegardes auto", "Audit complet"]}
                            color="red"
                        />
                        <FeatureCard 
                            icon={<Zap className="w-8 h-8" />}
                            title="Performance Ultra-Rapide"
                            description="Interface optimisée pour une vitesse d'exécution exceptionnelle et une expérience fluide."
                            features={["Temps de charge < 1s", "Optimisation auto", "Cache intelligent"]}
                            color="yellow"
                        />
                    </div>
                </div>
            </section>

            {/* Technical Features */}
            <section className="py-24 px-6 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl font-bold">Technologie de Pointe</h2>
                        <div className="w-24 h-2 bg-blue-400 mx-auto rounded-full"></div>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Construit avec les technologies les plus modernes pour garantir performance et fiabilité
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <TechFeature 
                            icon={<Cpu className="w-8 h-8" />}
                            title="Machine Learning"
                            description="Algorithmes d'apprentissage automatique pour des prédictions toujours plus précises"
                        />
                        <TechFeature 
                            icon={<Database className="w-8 h-8" />}
                            title="Big Data"
                            description="Traitement de millions de points de données pour des analyses pertinentes"
                        />
                        <TechFeature 
                            icon={<Globe className="w-8 h-8" />}
                            title="Cloud Native"
                            description="Architecture cloud évolutive disponible 24/7 dans le monde entier"
                        />
                        <TechFeature 
                            icon={<Lock className="w-8 h-8" />}
                            title="Blockchain Ready"
                            description="Support blockchain pour une traçabilité et sécurité maximales"
                        />
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">Intégrations Parfaites</h2>
                        <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            SmartRetail s'intègre parfaitement avec vos outils existants
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <IntegrationCard 
                            name="API RESTful"
                            description="API complète pour intégration personnalisée"
                            icon={<RefreshCw className="w-6 h-6" />}
                        />
                        <IntegrationCard 
                            name="Webhooks"
                            description="Notifications en temps réel vers vos systèmes"
                            icon={<Target className="w-6 h-6" />}
                        />
                        <IntegrationCard 
                            name="Export/Import"
                            description="Importez et exportez facilement vos données"
                            icon={<PieChart className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-5xl font-bold">Prêt à Révolutionner Votre Business?</h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Rejoignez des centaines d'entreprises qui font confiance à SmartRetail
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all inline-block shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                            Commencer Gratuitement
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all inline-block">
                            Voir la Démo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, features, color }) => {
    const colorClasses = {
        blue: "hover:border-blue-200 hover:shadow-blue-200/50",
        purple: "hover:border-purple-200 hover:shadow-purple-200/50",
        green: "hover:border-green-200 hover:shadow-green-200/50",
        orange: "hover:border-orange-200 hover:shadow-orange-200/50",
        red: "hover:border-red-200 hover:shadow-red-200/50",
        yellow: "hover:border-yellow-200 hover:shadow-yellow-200/50"
    };
    
    return (
        <div className={`group p-8 rounded-3xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 border-2 border-transparent transition-all duration-300 shadow-lg hover:shadow-2xl ${colorClasses[color]}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed font-medium mb-6">{description}</p>
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TechFeature = ({ icon, title, description }) => (
    <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
    </div>
);

const IntegrationCard = ({ name, description, icon }) => (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default Features;
