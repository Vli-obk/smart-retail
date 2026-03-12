import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CalendarDays
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_products: 0,
        total_sales: 0,
        low_stock: 0,
        total_revenue: 0,
        total_clients: 0,
        alerts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('dashboard/stats');
                const serverData = response.data.data; 
                setStats({
                  total_products: serverData.total_products || 0,
                  total_sales: serverData.total_sales || 0,
                  total_revenue: serverData.total_revenue || 0,
                  low_stock: serverData.low_stock_count || 0,
                  total_clients: serverData.total_clients || 0, 
                  alerts: serverData.low_stock_count || 0
                });
            } catch (err) {
                console.error("Erreur stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { 
            title: 'Revenue Total', 
            value: `${Number(stats.total_revenue || 0).toLocaleString()} DH`, 
            icon: <DollarSign className="w-6 h-6" />, 
            trend: '+12.5%', 
            trendUp: true,
            color: 'from-emerald-500 to-teal-600',
            lightColor: 'bg-emerald-50 text-emerald-600'
        },
        { 
            title: 'Commandes', 
            value: Number(stats.total_sales || 0).toLocaleString(), 
            icon: <ShoppingBag className="w-6 h-6" />, 
            trend: '+5.2%', 
            trendUp: true,
            color: 'from-blue-500 to-indigo-600',
            lightColor: 'bg-blue-50 text-blue-600'
        },
        { 
            title: 'Clients Actifs', 
            value: Number(stats.total_clients || 0).toLocaleString(), 
            icon: <Users className="w-6 h-6" />, 
            trend: '+3.1%', 
            trendUp: true,
            color: 'from-violet-500 to-purple-600',
            lightColor: 'bg-violet-50 text-violet-600'
        },
        { 
            title: 'Ruptures Stock', 
            value: Number(stats.low_stock || 0).toLocaleString(), 
            icon: <AlertTriangle className="w-6 h-6" />, 
            trend: '-2.4%', 
            trendUp: false,
            color: 'from-rose-500 to-red-600',
            lightColor: 'bg-rose-50 text-rose-600'
        },
    ];

    const chartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Ventes Hebdomadaires',
                data: [12400, 19200, 15800, 25100, 22300, 31000, 28500],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.45,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `${context.parsed.y.toLocaleString()} DH`
                }
            }
        },
        scales: {
            y: { 
                beginAtZero: true,
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: { color: '#94a3b8', font: { size: 11 } }
            },
            x: { 
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11 } }
            },
        },
    };

    return (
        <div className="p-8 animate-fade-in space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Overview</h1>
                    <p className="text-slate-500 font-medium">Monitoring real-time performance and analytics.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                    <button className="px-4 py-2 text-sm font-bold bg-slate-100 text-slate-900 rounded-xl">Real-time</button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">History</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${item.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${item.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {item.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {item.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">{item.title}</p>
                            <h3 className="text-2xl font-black text-slate-900">{loading ? '...' : item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Sales Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Revenue Performance</h2>
                            <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                                <Clock className="w-3.5 h-3.5" />
                                Values updated 5 minutes ago
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg text-blue-600 text-xs font-bold ring-1 ring-blue-100">
                                <CalendarDays className="w-3.5 h-3.5" />
                                Last 7 Days
                             </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Side Activity / System Health */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/40 transition-colors"></div>
                        <h2 className="text-xl font-bold mb-2 relative z-10">AI Predictor</h2>
                        <p className="text-slate-400 text-sm mb-6 relative z-10 uppercase tracking-widest font-black">Powered by Fast API</p>
                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-xs text-slate-400 mb-1">Expected Tomorrow</p>
                                <p className="text-xl font-black text-blue-400">+4,200 DH</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <p className="text-xs text-slate-400 mb-1">Stock Risk Level</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[15%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-500 uppercase">SAFE</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-xl shadow-black/20">
                            Run Smart Analysis
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <h2 className="text-lg font-black text-slate-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <ActionButton label="Add Product" color="bg-blue-50 text-blue-600" />
                            <ActionButton label="View Sales" color="bg-purple-50 text-purple-600" />
                            <ActionButton label="Reports" color="bg-amber-50 text-amber-600" />
                            <ActionButton label="Settings" color="bg-slate-50 text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ label, color }) => (
    <button className={`p-4 rounded-2xl font-bold text-xs transition-transform active:scale-95 ${color} text-center shadow-sm`}>
        {label}
    </button>
);

export default Dashboard;