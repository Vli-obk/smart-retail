import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
const heroImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";

const Home = () => {
    return (
        <div className="min-h-screen hero-gradient flex flex-col pt-20">
            <Navbar />
            
            {/* Hero Section */}
            <section className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-12 lg:py-24 gap-12 max-w-7xl mx-auto w-full">
                <div className="lg:w-1/2 space-y-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-bold text-sm tracking-wide">
                        <Sparkles className="w-4 h-4" />
                        AI-POWERED RETAIL EVOLUTION
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                        Predict Demand, <br />
                        <span className="text-blue-600">Automate Profits.</span>
                    </h1>
                    
                    <p className="text-xl text-slate-600 max-w-md leading-relaxed">
                        The ultimate intelligent management platform for modern retail. Stay ahead of stock-outs with our advanced AI prediction engine.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/login" className="btn-primary flex items-center justify-center gap-2 group">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/about" className="btn-outline">
                            View Demo
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 pt-8 text-slate-400">
                        <div className="flex -space-x-2">
                             {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                    {String.fromCharCode(64+i)}
                                </div>
                             ))}
                        </div>
                        <p className="text-sm font-medium">Trusted by <span className="text-slate-900 font-bold">100+</span> retail stores in Morocco</p>
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
            <section className="bg-white py-24 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900">Experience Intelligent Management</h2>
                        <p className="text-lg text-slate-500">Every feature we've built is designed to optimize your operations and maximize your ROI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<Zap className="w-8 h-8 text-blue-600" />}
                            title="AI Stock Prediction"
                            desc="Know exactly when to restock before you even run out. Our Scikit-learn engine never misses a beat."
                        />
                        <FeatureCard 
                            icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
                            title="Visual Analytics"
                            desc="Real-time sales insights presented in beautiful, actionable charts powered by Recharts."
                        />
                        <FeatureCard 
                            icon={<ShieldCheck className="w-8 h-8 text-emerald-600" />}
                            title="Secure Admin Control"
                            desc="Manage clients, products, and sales with our robust Laravel JWT authentication system."
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
                        Access Admin Dashboard
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