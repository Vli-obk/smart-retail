import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  Users,
  Building,
  Globe,
  MessageSquare,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Headphones,
  Calendar,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        plan: 'professional'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Real API call to send contact message
            await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                company: formData.company,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message,
                plan: formData.plan
            });
            
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                subject: '',
                message: '',
                plan: 'professional'
            });
        } catch (err) {
            console.error('Error sending contact form:', err);
            setIsSubmitting(false);
            alert('Erreur: ' + (err.response?.data?.message || 'Impossible d\'envoyer le message'));
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-2xl border border-green-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Envoyé avec Succès!</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
                        </p>
                        <button 
                            onClick={() => setIsSubmitted(false)}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                            Envoyer un autre message
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-16 px-6 lg:px-24">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-bold text-sm uppercase tracking-wider border border-blue-200 shadow-lg">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                                Contactez-Nous
                            </div>
                            
                            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                                Parlons de Votre <span className="text-blue-600">Succès</span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 font-medium leading-relaxed">
                                Notre équipe d'experts est prête à vous aider à transformer votre entreprise avec nos solutions intelligentes.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ContactInfo 
                                    icon={<Mail className="w-5 h-5" />}
                                    label="Email"
                                    value="contact@smartretail.ma"
                                />
                                <ContactInfo 
                                    icon={<Phone className="w-5 h-5" />}
                                    label="Téléphone"
                                    value="+212 522-123456"
                                />
                                <ContactInfo 
                                    icon={<MapPin className="w-5 h-5" />}
                                    label="Adresse"
                                    value="Casablanca, Maroc"
                                />
                                <ContactInfo 
                                    icon={<Clock className="w-5 h-5" />}
                                    label="Horaires"
                                    value="Lun-Ven: 9h-18h"
                                />
                            </div>
                        </div>

                        <div className="relative animate-fade-in [animation-delay:200ms]">
                            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Jean Dupont"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="jean@entreprise.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Entreprise</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Votre entreprise"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="+212 5XX-XXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Sujet *</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Choisissez un sujet</option>
                                            <option value="demo">Demande de démo</option>
                                            <option value="support">Support technique</option>
                                            <option value="partnership">Partenariat</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Décrivez votre projet ou vos besoins..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Plan d'intérêt</label>
                                        <select
                                            name="plan"
                                            value={formData.plan}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="starter">Starter</option>
                                            <option value="professional">Professional</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Envoi en cours...
                                            </>
                                        ) : (
                                            <>
                                                Envoyer le message
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-24 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900">Nos Bureaux</h2>
                        <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Retrouvez-nous dans nos bureaux à travers le Maroc
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <OfficeCard 
                            city="Casablanca"
                            address="Boulevard d'Anfa, 20000 Casablanca"
                            phone="+212 522-123456"
                            email="casablanca@smartretail.ma"
                            hours="Lun-Ven: 9h-18h"
                        />
                        <OfficeCard 
                            city="Rabat"
                            address="Avenue Mohammed V, 10000 Rabat"
                            phone="+212 537-987654"
                            email="rabat@smartretail.ma"
                            hours="Lun-Ven: 9h-18h"
                        />
                        <OfficeCard 
                            city="Marrakech"
                            address="Guéliz, 40000 Marrakech"
                            phone="+212 524-456789"
                            email="marrakech@smartretail.ma"
                            hours="Lun-Ven: 9h-18h"
                        />
                    </div>
                </div>
            </section>

            {/* Support Options */}
            <section className="py-24 px-6 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-6">
                        <h2 className="text-4xl font-bold">Support 24/7</h2>
                        <div className="w-24 h-2 bg-blue-400 mx-auto rounded-full"></div>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Plusieurs façons de nous contacter pour une assistance rapide
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <SupportOption 
                            icon={<Headphones className="w-8 h-8" />}
                            title="Support Téléphonique"
                            description="Assistance directe par téléphone"
                            action="Appeler maintenant"
                        />
                        <SupportOption 
                            icon={<MessageSquare className="w-8 h-8" />}
                            title="Chat en Direct"
                            description="Support instantané par chat"
                            action="Démarrer le chat"
                        />
                        <SupportOption 
                            icon={<Mail className="w-8 h-8" />}
                            title="Email Prioritaire"
                            description="Réponse sous 2h garantie"
                            action="Envoyer un email"
                        />
                        <SupportOption 
                            icon={<Calendar className="w-8 h-8" />}
                            title="Rendez-vous"
                            description="Planifiez un appel avec un expert"
                            action="Prendre RDV"
                        />
                    </div>
                </div>
            </section>

            {/* Social Media */}
            <section className="py-16 px-6 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-gray-900">Suivez-nous</h3>
                        <p className="text-gray-600">
                            Restez connecté avec les dernières actualités et mises à jour
                        </p>
                        <div className="flex items-center justify-center gap-6">
                            <SocialLink icon={<Facebook className="w-6 h-6" />} name="Facebook" />
                            <SocialLink icon={<Twitter className="w-6 h-6" />} name="Twitter" />
                            <SocialLink icon={<Linkedin className="w-6 h-6" />} name="LinkedIn" />
                            <SocialLink icon={<Instagram className="w-6 h-6" />} name="Instagram" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ContactInfo = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="text-blue-600">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const OfficeCard = ({ city, address, phone, email, hours }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-4">
            <Building className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">{city}</h3>
        </div>
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-gray-600 text-sm">{address}</p>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600 text-sm">{phone}</p>
            </div>
            <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600 text-sm">{email}</p>
            </div>
            <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600 text-sm">{hours}</p>
            </div>
        </div>
    </div>
);

const SupportOption = ({ icon, title, description, action }) => (
    <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
            {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all">
            {action}
        </button>
    </div>
);

const SocialLink = ({ icon, name }) => (
    <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-all">
        {icon}
    </button>
);

export default Contact;
