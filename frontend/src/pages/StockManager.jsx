import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight,
  Users,
  Banknote,
  Activity,
  Calendar,
  RefreshCw,
  Search,
  Settings,
  LogOut
} from 'lucide-react';

const StockManager = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        pendingOrders: 0,
        totalProducts: 0,
        lowStockAlerts: 0,
        recentMovements: 0
    });
    const [pendingOrders, setPendingOrders] = useState([]);
    const [stockLevels, setStockLevels] = useState([]);
    const [recentMovements, setRecentMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchStockManagerData();
    }, []);

    const fetchStockManagerData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching stock manager data...');
            
            // Fetch real data from backend - one by one to avoid Promise.all crashing
            let ordersRes = { data: { data: [] } };
            let productsRes = { data: { data: [] } };
            let alertsRes = { data: { data: [] } };
            let movementsRes = { data: { data: [] } };

            try {
                ordersRes = await api.get('/orders');
            } catch (err) {
                console.error('Orders API error:', err);
            }

            try {
                productsRes = await api.get('/products');
            } catch (err) {
                console.error('Products API error:', err);
            }

            try {
                alertsRes = await api.get('/alerts');
            } catch (err) {
                console.error('Alerts API error:', err);
            }

            try {
                movementsRes = await api.get('/stock-movements');
            } catch (err) {
                console.error('Movements API error:', err);
            }

            console.log('API Responses:', { ordersRes, productsRes, alertsRes, movementsRes });

            // Process orders data
            const orders = Array.isArray(ordersRes.data?.data) ? ordersRes.data.data : 
                          Array.isArray(ordersRes.data) ? ordersRes.data : [];
            
            // Map backend fields to frontend expected format
            const mappedOrders = orders.map(order => ({
                id: order.id,
                customer: order.client_name || order.customer || 'Client inconnu',
                date: order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : order.date,
                time: order.created_at ? new Date(order.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : order.time,
                totalAmount: parseFloat(order.total_amount || order.totalAmount || 0),
                items: Array.isArray(order.items) ? order.items.map(item => ({
                    id: item.id || item.product_id,
                    name: item.product?.name || item.product_name || item.name,
                    quantity: item.quantity,
                    currentStock: item.current_stock || item.currentStock || 0,
                    minStock: item.min_stock || item.minStock || 0
                })) : [],
                urgency: order.urgency || 'medium',
                status: order.status
            }));
            
            const pendingOrders = mappedOrders.filter(order => order.status === 'pending');
            console.log('Pending orders (mapped):', pendingOrders);
            
            // Process products data
            const products = Array.isArray(productsRes.data?.data) ? productsRes.data.data : 
                           Array.isArray(productsRes.data) ? productsRes.data : [];
            
            const lowStockProducts = products.filter(product => 
                product.quantity <= product.min_threshold
            );
            console.log('Low stock products:', lowStockProducts);

            // Process alerts data
            const alerts = Array.isArray(alertsRes.data?.data) ? alertsRes.data.data : 
                          Array.isArray(alertsRes.data) ? alertsRes.data : [];

            // Process movements data
            const movements = Array.isArray(movementsRes.data?.data) ? movementsRes.data.data : 
                             Array.isArray(movementsRes.data) ? movementsRes.data : [];

            // Set stats
            const newStats = {
                pendingOrders: pendingOrders.length,
                totalProducts: products.length,
                lowStockAlerts: lowStockProducts.length,
                recentMovements: movements.length
            };
            console.log('New stats:', newStats);
            setStats(newStats);

            // Set detailed data
            setPendingOrders(pendingOrders);
            setStockLevels(products);
            setRecentMovements(movements);

        } catch (err) {
            console.error('Error fetching stock manager data:', err);
            setError(err.message || 'Failed to load data');
            // Set empty data on error
            setStats({
                pendingOrders: 0,
                totalProducts: 0,
                lowStockAlerts: 0,
                recentMovements: 0
            });
            setPendingOrders([]);
            setStockLevels([]);
            setRecentMovements([]);
        } finally {
            setLoading(false);
        }
    };

    // Show error state if there's an error
    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-red-800 font-bold mb-2">Error Loading Stock Manager</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchStockManagerData}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const handleOrderAction = async (orderId, action) => {
        try {
            // Real API call to update order status
            await api.put(`/orders/${orderId}/status`, {
                status: action === 'approve' ? 'approved' : 'rejected'
            });
            
            // Instant UI update - remove from pending orders immediately
            setPendingOrders(prev => prev.filter(o => o.id !== orderId));
            
            // Update stats instantly
            setStats(prev => ({
                ...prev,
                pendingOrders: Math.max(0, prev.pendingOrders - 1)
            }));
            
            // Add to movements instantly for approved orders
            if (action === 'approve') {
                const order = pendingOrders.find(o => o.id === orderId);
                if (order) {
                    const newMovements = order.items.map(item => ({
                        id: `MOV-${Date.now()}-${item.id}`,
                        product: item.name,
                        type: 'out',
                        quantity: item.quantity,
                        date: new Date().toISOString().split('T')[0],
                        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        reference: orderId
                    }));
                    setRecentMovements(prev => [...newMovements, ...prev]);
                }
            }
            
        } catch (err) {
            console.error(`Error ${action}ing order:`, err);
        }
    };

    const getStockStatus = (current, min) => {
        if (current <= min * 0.5) return { status: 'critical', color: 'red', label: 'Critique' };
        if (current <= min) return { status: 'low', color: 'yellow', label: 'Bas' };
        return { status: 'good', color: 'green', label: 'Normal' };
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSettings = () => {
        navigate('/app/settings');
    };

    const getMovementTypeConfig = (type) => {
        return type === 'in' 
            ? { color: 'green', label: 'Entrée', icon: <ArrowDownRight className="w-4 h-4" /> }
            : { color: 'red', label: 'Sortie', icon: <ArrowUpRight className="w-4 h-4" /> };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord - Gestionnaire de Stock</h1>
                    <p className="text-gray-600 mt-1">Gérez les commandes en attente et surveillez les niveaux de stock</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSettings}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={fetchStockManagerData}
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Commandes en Attente</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Produits</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalProducts}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Alertes de Stock</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">{stats.lowStockAlerts}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Mouvements Récents</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{stats.recentMovements}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Commandes en Attente</h2>
                    <button 
                        onClick={() => navigate('/app/orders')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Voir tout
                    </button>
                </div>

                {pendingOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                        <p className="text-green-600 font-medium">Aucune commande en attente</p>
                        <p className="text-gray-400 text-sm mt-2">Toutes les commandes ont été traitées</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingOrders.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-500">{order.customer}</p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <p>{order.date}</p>
                                            <p>{order.time}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.totalAmount.toFixed(2)} DH
                                        </div>
                                        {order.urgency === 'high' && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                Urgent
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Produits demandés:</p>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => {
                                            const stockStatus = getStockStatus(item.currentStock, item.minStock);
                                            return (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            stockStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                                                            stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            Stock: {item.currentStock}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleOrderAction(order.id, 'approve')}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => handleOrderAction(order.id, 'reject')}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Rejeter
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Current Stock Levels */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Niveaux de Stock Actuels</h2>
                    <button 
                        onClick={() => navigate('/app/products')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Voir tout
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Produit</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Catégorie</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock Actuel</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock Min</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock Max</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockLevels.map((product) => {
                                const stockStatus = getStockStatus(product.current, product.min);
                                return (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{product.category}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-gray-900">{product.current}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{product.min}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-sm text-gray-600">{product.max}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                stockStatus.color === 'red' ? 'bg-red-100 text-red-700' :
                                                stockStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {stockStatus.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Stock Movements */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Mouvements de Stock Récents</h2>
                    <button 
                        onClick={() => navigate('/app/alerts')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Voir tout
                    </button>
                </div>

                <div className="space-y-3">
                    {recentMovements.slice(0, 5).map((movement) => {
                        const typeConfig = getMovementTypeConfig(movement.type);
                        return (
                            <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        movement.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {typeConfig.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{movement.product}</p>
                                        <p className="text-xs text-gray-500">{movement.reference}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${
                                        movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                                    </p>
                                    <p className="text-xs text-gray-500">{movement.date} {movement.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StockManager;
