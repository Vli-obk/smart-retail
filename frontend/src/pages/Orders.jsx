import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ShoppingCart, 
  User, 
  Calendar, 
  Banknote, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Filter,
  Search,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Star,
  LogOut,
  Minus,
  AlertTriangle
} from 'lucide-react';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Mock data - replace with API call
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('/orders');
            const ordersData = Array.isArray(response.data) 
                ? response.data 
                : (response.data.data || []);
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                label: 'En attente',
                icon: <Clock className="w-4 h-4" />,
                bgColor: 'bg-amber-50',
                textColor: 'text-amber-700'
            },
            approved: {
                label: 'Approuvée',
                icon: <CheckCircle className="w-4 h-4" />,
                bgColor: 'bg-green-50',
                textColor: 'text-green-700'
            },
            rejected: {
                label: 'Rejetée',
                icon: <XCircle className="w-4 h-4" />,
                bgColor: 'bg-rose-50',
                textColor: 'text-rose-700'
            },
            delivered: {
                label: 'Livrée',
                icon: <Package className="w-4 h-4" />,
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700'
            }
        };
        return configs[status] || configs.pending;
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            high: {
                color: 'rose',
                label: 'Urgent',
                icon: <ArrowUpRight className="w-3 h-3" />
            },
            normal: {
                color: 'slate',
                label: 'Normal',
                icon: <ArrowDownRight className="w-3 h-3" />
            }
        };
        return configs[priority] || configs.normal;
    };

    const filteredOrders = orders.filter(order => {
        const customerName = order.client?.name || order.client_name || '';
        const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (order.client?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let aValue, bValue;
        
        switch(sortBy) {
            case 'date':
                aValue = new Date(a.created_at || a.date);
                bValue = new Date(b.created_at || b.date);
                break;
            case 'amount':
                aValue = parseFloat(a.total_amount || a.amount || 0);
                bValue = parseFloat(b.total_amount || b.amount || 0);
                break;
            case 'customer':
                aValue = (a.client?.name || a.client_name || '').toLowerCase();
                bValue = (b.client?.name || b.client_name || '').toLowerCase();
                break;
            default:
                aValue = new Date(a.created_at || a.date);
                bValue = new Date(b.created_at || b.date);
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        approved: orders.filter(o => o.status === 'approved').length,
        rejected: orders.filter(o => o.status === 'rejected').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders
            .filter(o => o.status === 'approved')
            .reduce((sum, o) => sum + parseFloat(o.total_amount || o.amount || 0), 0)
    };

    const calcChange = (current, previous) => {
        if (!previous || previous === 0) return { percentage: 0, trend: 'neutral' };
        const diff = ((current - previous) / previous) * 100;
        return {
            percentage: Math.abs(Math.round(diff)),
            trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
        };
    };

    const TrendBadge = ({ current, previous }) => {
        const { percentage, trend } = calcChange(current, previous);
        const colors = { 
            up: 'text-emerald-600 bg-emerald-50', 
            down: 'text-rose-600 bg-rose-50', 
            neutral: 'text-slate-500 bg-slate-50' 
        };
        const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
        return (
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors[trend]}`}>
                <Icon className="w-3 h-3" />
                {percentage}%
            </span>
        );
    };

    if (loading) {
        return (
            <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Commandes</h1>
                        <p className="text-slate-500">Gérez toutes les commandes des clients</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-slate-100 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header - Dashboard Style */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Commandes</h1>
                    <p className="text-slate-500">Gérez toutes les commandes des clients</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        <Download className="w-5 h-5 text-slate-600" />
                    </button>
                    <button 
                        onClick={fetchOrders}
                        className="p-2 bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-5 h-5 text-slate-600" />
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Stats Cards - Dashboard Style with Trend Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: 'Total Commandes', 
                        value: stats.total, 
                        prev: 0, 
                        icon: <ShoppingCart className="w-5 h-5" />, 
                        color: 'bg-blue-50 text-blue-600' 
                    },
                    { 
                        title: 'En Attente', 
                        value: stats.pending, 
                        prev: 0, 
                        icon: <Clock className="w-5 h-5" />, 
                        color: 'bg-amber-50 text-amber-600' 
                    },
                    { 
                        title: 'Approuvées', 
                        value: stats.approved, 
                        prev: 0, 
                        icon: <CheckCircle className="w-5 h-5" />, 
                        color: 'bg-emerald-50 text-emerald-600' 
                    },
                    { 
                        title: 'Revenu Total', 
                        value: `${stats.totalRevenue.toLocaleString()} DH`, 
                        prev: 0, 
                        icon: <Banknote className="w-5 h-5" />, 
                        color: 'bg-violet-50 text-violet-600' 
                    },
                ].map(({ title, value, prev, icon, color }) => (
                    <div key={title} className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
                            <TrendBadge current={typeof value === 'number' ? value : parseFloat(value)} previous={prev} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{value}</p>
                        <p className="text-sm text-slate-500 mt-1">{title}</p>
                    </div>
                ))}
            </div>

            {/* Filters and Search - Clean Dashboard Style */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher par client, email ou numéro de commande..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuvées</option>
                        <option value="rejected">Rejetées</option>
                        <option value="delivered">Livrées</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                        <option value="date">Trier par date</option>
                        <option value="amount">Trier par montant</option>
                        <option value="customer">Trier par client</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="px-4 py-3 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 font-medium"
                    >
                        {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
                    </button>
                </div>
            </div>

            {/* Orders Table - Dashboard Style */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Liste des Commandes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500">
                                <th className="text-left py-4 px-6 font-medium text-sm">Commande</th>
                                <th className="text-left py-4 px-6 font-medium text-sm">Client</th>
                                <th className="text-left py-4 px-6 font-medium text-sm">Date</th>
                                <th className="text-left py-4 px-6 font-medium text-sm">Montant</th>
                                <th className="text-left py-4 px-6 font-medium text-sm">Statut</th>
                                <th className="text-left py-4 px-6 font-medium text-sm">Priorité</th>
                                <th className="text-left py-4 px-6 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((order) => {
                                const statusConfig = getStatusConfig(order.status);
                                const priorityConfig = getPriorityConfig(order.priority || 'normal');
                                const orderDate = new Date(order.created_at || order.date);
                                
                                return (
                                    <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">#{order.id}</p>
                                                <p className="text-xs text-slate-400">{order.payment_method || 'Carte'}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{order.client?.name || order.client_name || 'Client'}</p>
                                                    <p className="text-xs text-slate-400">{order.client?.email || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm text-slate-900">{orderDate.toLocaleDateString('fr-FR')}</p>
                                                <p className="text-xs text-slate-400">{orderDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm font-medium text-slate-900">{parseFloat(order.total_amount || order.amount || 0).toFixed(2)} DH</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                {statusConfig.icon}
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                                order.priority === 'high' 
                                                    ? 'bg-rose-100 text-rose-700' 
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {priorityConfig.icon}
                                                {priorityConfig.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {sortedOrders.length === 0 && (
                    <div className="text-center py-12">
                        <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">Aucune commande trouvée</p>
                        <p className="text-slate-400 text-sm mt-2">Essayez de modifier vos filtres de recherche</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
