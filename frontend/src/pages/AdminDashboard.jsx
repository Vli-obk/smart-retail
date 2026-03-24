import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Search, 
  Trash2, 
  Edit, 
  ShieldCheck,
  UserPlus,
  RefreshCw,
  Mail,
  UserCog,
  AlertCircle,
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
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
import { Line } from 'react-chartjs-2';

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

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        refreshDashboard();
    }, []);

    const refreshDashboard = () => {
        fetchStats();
        fetchOrders();
        fetchChartData();
    };

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const response = await api.get('/admin/dashboard/stats');
            const rawData = response.data.data || response.data;
            setStats({
                total_products: rawData.total_products || 0,
                total_clients: rawData.total_clients || 0,
                total_orders: rawData.total_orders || 0,
                total_revenue: rawData.total_revenue || 0,
                pending_orders: rawData.pending_orders || 0
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
            setStats({ total_products: 0, total_clients: 0, total_orders: 0, total_revenue: 0 });
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            const orderData = response.data.data || response.data;
            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await api.get('/admin/dashboard/chart');
            const data = response.data.data || response.data;
            
            if (Array.isArray(data)) {
              const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const values = data.map(item => item.revenue || 0);
              
              setChartData({
                labels,
                datasets: [
                  {
                    label: 'Revenu Mensuel (DH)',
                    data: values,
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                  }
                ]
              });
            }
        } catch (err) {
            console.error("Error fetching chart data:", err);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/orders/${id}/status`, { status });
            fetchOrders();
            fetchStats();
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Erreur lors de la mise à jour du statut.");
        }
    };

    const filteredOrders = Array.isArray(orders) ? orders.filter(order => 
        (order.client_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        order.id.toString().includes(searchTerm)
    ) : [];

    const statCards = [
        { label: 'Revenu Total', value: stats?.total_revenue ? `${stats.total_revenue.toLocaleString()} DH` : '0 DH', icon: <TrendingUp />, color: 'bg-emerald-500' },
        { label: 'Clients Globaux', value: stats?.total_clients || 0, icon: <Users />, color: 'bg-blue-600' },
        { label: 'Total Produits', value: stats?.total_products || 0, icon: <Package />, color: 'bg-violet-600' },
        { label: 'Commandes', value: stats?.total_orders || 0, icon: <ShoppingBag />, color: 'bg-amber-500' },
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (context) => ` ${context.parsed.y.toLocaleString()} DH`
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
            }
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'approved': return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 ring-amber-100';
            case 'rejected': return 'bg-rose-50 text-rose-600 ring-rose-100';
            default: return 'bg-slate-50 text-slate-600 ring-slate-100';
        }
    };

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShieldCheck className="w-10 h-10 text-blue-600" />
                        Administration
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Gérez les performances globales et surveillez les ventes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={refreshDashboard}
                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-2 font-bold text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} />
                        Rafraîchir
                    </button>
                    <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernière mise à jour</p>
                        <p className="text-xs font-bold text-slate-600">{new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-[0.03] rounded-bl-[4rem] group-hover:scale-110 transition-transform duration-500`}></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl ${card.color} text-white shadow-lg`}>
                                {React.cloneElement(card.icon, { className: 'w-6 h-6' })}
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-slate-900">{statsLoading ? '...' : card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Analyse des Revenus</h2>
                            <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                                <Clock className="w-3.5 h-3.5" />
                                Revenu annuel en (DH)
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-500 text-xs font-bold ring-1 ring-slate-100">
                           <Calendar className="w-3.5 h-3.5" />
                           Année {new Date().getFullYear()}
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        {chartData ? <Line data={chartData} options={chartOptions} /> : <div className="h-full flex items-center justify-center text-slate-400 italic">Chargement du graphique...</div>}
                    </div>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group self-start">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-xl font-bold mb-2 relative z-10 tracking-tight">Focus Système</h2>
                    <p className="text-blue-400 text-xs mb-6 relative z-10 uppercase tracking-widest font-black">Performance Globale</p>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-xs text-slate-400 mb-1 font-bold italic">Commandes en attente</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-black text-white">{stats?.pending_orders || 0}</p>
                                <div className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[10px] font-black uppercase tracking-tighter ring-1 ring-amber-500/20">Action requise</div>
                            </div>
                        </div>
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <p className="text-xs text-slate-400 mb-1 font-bold italic">Satisfaction Moyenne</p>
                            <p className="text-2xl font-black text-emerald-400">92%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales History Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Historique des Ventes</h2>
                            <p className="text-sm text-slate-400 font-medium">Consultez et gérez les dernières transactions clients.</p>
                        </div>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Rechercher par client ou N° Commande..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto px-4 pb-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 text-left border-b border-slate-50">
                                <th className="px-6 py-5 uppercase text-[10px] font-black tracking-widest">N° Commande</th>
                                <th className="px-6 py-5 uppercase text-[10px] font-black tracking-widest">Client</th>
                                <th className="px-6 py-5 uppercase text-[10px] font-black tracking-widest">Produits</th>
                                <th className="px-6 py-5 uppercase text-[10px] font-black tracking-widest">Montant</th>
                                <th className="px-6 py-5 uppercase text-[10px] font-black tracking-widest">Statut</th>
                                <th className="px-6 py-5 uppercase text-[10px] font-black tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-20 text-slate-400 font-medium italic">Chargement des ventes...</td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <ShoppingBag className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-400 font-medium font-bold italic">Aucune vente trouvée.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                    <td className="px-6 py-5">
                                        <p className="font-black text-slate-900 text-xs">#SR-{order.id.toString().padStart(4, '0')}</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900">{order.client_name}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            {order.order_items?.slice(0, 2).map((item, i) => (
                                                <p key={i} className="text-xs text-slate-500 font-medium">
                                                    {item.quantity}x {item.product_name}
                                                </p>
                                            ))}
                                            {order.order_items?.length > 2 && (
                                                <p className="text-[10px] text-blue-500 font-bold italic">
                                                    +{order.order_items.length - 2} autres produits
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-black text-slate-900">{order.total_amount?.toLocaleString()} <span className="text-[10px] text-slate-400">DH</span></p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ring-1 ${getStatusStyle(order.status)}`}>
                                            {order.status === 'approved' ? 'Validée' : order.status === 'pending' ? 'En attente' : 'Rejetée'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 isolate opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            {order.status === 'pending' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order.id, 'approved')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black shadow-sm ring-1 ring-emerald-100 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Valider
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order.id, 'rejected')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-black shadow-sm ring-1 ring-rose-100 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Rejeter
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all" title="Détails">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
