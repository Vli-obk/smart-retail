import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Crown,
  Users,
  BarChart3,
  BrainCircuit,
  Headphones,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState('professional');

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            description: 'Parfait pour les petites entreprises en démarrage',
            price: billingCycle === 'monthly' ? 29 : 290,
            originalPrice: billingCycle === 'monthly' ? null : 348,
            features: [
                'Jusqu\'à 100 produits',
                '1,000 commandes/mois',
                'Analytics de base',
                'Support par email',
                'API limitée',
                '2 utilisateurs',
                'Stock alerts',
                'Rapports mensuels'
            ],
            excludedFeatures: [
                'Prédictions IA',
                'API avancée',
                'Support prioritaire',
                'Personnalisation'
            ],
            color: 'gray',
            popular: false
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Solution complète pour entreprises en croissance',
            price: billingCycle === 'monthly' ? 79 : 790,
            originalPrice: billingCycle === 'monthly' ? null : 948,
            features: [
                'Jusqu\'à 1,000 produits',
                '10,000 commandes/mois',
                'Analytics avancées',
                'Support prioritaire',
                'API complète',
                '10 utilisateurs',
                'Prédictions IA avancées',
                'Rapports en temps réel',
                'Intégrations CRM',
                'Export personnalisé'
            ],
            excludedFeatures: [
                'API entreprise',
                'Dédié SLA',
                'Formation sur mesure'
            ],
            color: 'blue',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Solution sur mesure pour grandes entreprises',
            price: billingCycle === 'monthly' ? 199 : 1990,
            originalPrice: billingCycle === 'monthly' ? null : 2388,
            features: [
                'Produits illimités',
                'Commandes illimitées',
                'Analytics entreprise',
                'Support 24/7 dédié',
                'API entreprise',
                'Utilisateurs illimités',
                'IA sur mesure',
                'Tableaux de bord personnalisés',
                'Intégrations sur mesure',
                'SLA garanti',
                'Formation incluse',
                'Déploiement assisté'
            ],
            excludedFeatures: [],
            color: 'purple',
            popular: false
        }
    ];

    const getPlanStyles = (color, popular) => {
        const baseStyles = {
            gray: 'border-gray-200 hover:border-gray-300',
            blue: 'border-blue-500 hover:border-blue-600',
            purple: 'border-purple-500 hover:border-purple-600'
        };
        
        return popular 
            ? `${baseStyles[color]} ring-4 ring-blue-100 shadow-2xl scale-105` 
            : baseStyles[color];
    };

    const getButtonStyles = (color, popular) => {
        const baseStyles = {
            gray: 'bg-gray-600 hover:bg-gray-700 text-white',
            blue: 'bg-blue-600 hover:bg-blue-700 text-white',
            purple: 'bg-purple-600 hover:bg-purple-700 text-white'
        };
        
        return popular 
            ? `${baseStyles[color]} shadow-lg hover:shadow-xl transform hover:-translate-y-1` 
            : baseStyles[color];
    };

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
                            <Crown className="w-5 h-5 text-blue-600" />
                            Tarifs Flexibles
                        </div>
                        
                        <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tight">
                            Choisissez Votre <span className="text-blue-600">Plan Idéal</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto">
                            Des tarifs transparents adaptés à vos besoins, avec la possibilité de changer à tout moment
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                                Mensuel
                            </span>
                            <button
                                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors focus:outline-none"
                            >
                                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`}></span>
                            </button>
                            <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                                Annuel <span className="text-green-600 font-bold">(Économisez 17%)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-3xl border-2 transition-all duration-300 ${getPlanStyles(plan.color, plan.popular)}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Plus Populaire
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-gray-600 mb-6">{plan.description}</p>
                                        
                                        <div className="mb-4">
                                            {plan.originalPrice && (
                                                <span className="text-gray-400 line-through text-lg">
                                                    {plan.originalPrice} DH
                                                </span>
                                            )}
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-5xl font-black text-gray-900">
                                                    {plan.price}
                                                </span>
                                                <span className="text-gray-600 font-bold ml-1 text-xl self-end mb-1">
                                                    DH
                                                </span>
                                                <span className="text-gray-600 font-medium ml-1">
                                                    /{billingCycle === 'monthly' ? 'mois' : 'an'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                        
                                        {plan.excludedFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 opacity-50">
                                                <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-500 line-through">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${getButtonStyles(plan.color, plan.popular)}`}
                                    >
                                        {selectedPlan === plan.id ? 'Sélectionné ✓' : `Choisir ${plan.name}`}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">Comparaison des Fonctionnalités</h2>
                        <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Une vue d'ensemble détaillée de ce que chaque plan vous offre
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left p-4 font-bold text-gray-900 border-b-2 border-gray-200">Fonctionnalité</th>
                                    <th className="text-center p-4 font-bold text-gray-900 border-b-2 border-gray-200">Starter</th>
                                    <th className="text-center p-4 font-bold text-blue-600 border-b-2 border-blue-200">Professional</th>
                                    <th className="text-center p-4 font-bold text-purple-600 border-b-2 border-purple-200">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: 'Produits', starter: '100', pro: '1,000', enterprise: 'Illimités' },
                                    { feature: 'Commandes/mois', starter: '1,000', pro: '10,000', enterprise: 'Illimitées' },
                                    { feature: 'Utilisateurs', starter: '2', pro: '10', enterprise: 'Illimités' },
                                    { feature: 'Analytics', starter: 'Basiques', pro: 'Avancées', enterprise: 'Entreprise' },
                                    { feature: 'Support', starter: 'Email', pro: 'Prioritaire', enterprise: '24/7 Dédié' },
                                    { feature: 'API', starter: 'Limitée', pro: 'Complète', enterprise: 'Entreprise' },
                                    { feature: 'Prédictions IA', starter: false, pro: true, enterprise: true },
                                    { feature: 'Customisation', starter: false, pro: false, enterprise: true }
                                ].map((row, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                                        <td className="p-4 text-center">
                                            {typeof row.starter === 'boolean' ? (
                                                row.starter ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                                            ) : (
                                                <span className="font-medium">{row.starter}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center bg-blue-50">
                                            {typeof row.pro === 'boolean' ? (
                                                row.pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                                            ) : (
                                                <span className="font-medium text-blue-600">{row.pro}</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center bg-purple-50">
                                            {typeof row.enterprise === 'boolean' ? (
                                                row.enterprise ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                                            ) : (
                                                <span className="font-medium text-purple-600">{row.enterprise}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">Questions Fréquentes</h2>
                        <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-xl text-gray-600">
                            Tout ce que vous devez savoir sur nos tarifs et plans
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                question: 'Puis-je changer de plan à tout moment?',
                                answer: 'Oui! Vous pouvez passer à un plan supérieur à tout moment. Le changement sera effectif immédiatement et nous ajusterons le prorata.'
                            },
                            {
                                question: 'Y a-t-il des frais cachés?',
                                answer: 'Absolument pas. Le prix que vous voyez est le prix que vous payez. Aucuns frais d\'installation, de migration ou d\'annulation.'
                            },
                            {
                                question: 'Comment fonctionne l\'essai gratuit?',
                                answer: 'Nous offrons 14 jours d\'essai gratuit sur tous nos plans. Aucune carte de crédit requise, et vous pouvez annuler à tout moment.'
                            },
                            {
                                question: 'Quelles méthodes de paiement acceptez-vous?',
                                answer: 'Nous acceptons toutes les cartes de crédit majeures, PayPal, virements bancaires, et pour les entreprises nous proposons aussi les factures.'
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="flex items-center justify-center gap-3">
                        <Headphones className="w-8 h-8" />
                        <h2 className="text-4xl font-bold">Besoin d\'Aide pour Choisir?</h2>
                    </div>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Notre équipe d\'experts est disponible pour vous aider à trouver le plan parfait pour votre entreprise
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all inline-block shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3">
                            Contacter un Expert
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all inline-block">
                            Planifier une Démo
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
