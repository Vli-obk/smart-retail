import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Users, AlertTriangle, DollarSign } from 'lucide-react';
// --- 1. Zidna had l-imports dyal l-Graphique ---
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

// --- 2. Zidna l-Enregistrement dyal l-composants dyal Chart.js ---
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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('dashboard/stats');
                const serverData = response.data.data; 

                setStats({
                  total_products: serverData.total_products || 0,
                  total_sales: serverData.total_sales || 0,
                  total_revenue: serverData.total_revenue || 0,
                  low_stock: serverData.low_stock_count || 0, // T2kkdi mn had l-ism
                  total_clients: serverData.total_clients || 0, 
                  alerts: serverData.low_stock_count || 0
              });
            } catch (err) {
                console.error("Erreur stats", err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Produits', value: stats.total_products, icon: <ShoppingBag size={24}/>, color: 'bg-blue-500' },
        { title: 'Clients/Gérants', value: stats.total_clients, icon: <Users size={24}/>, color: 'bg-green-500' },
        { title: 'Alertes Stock', value: stats.low_stock, icon: <AlertTriangle size={24}/>, color: 'bg-red-500' },
        { title: 'Chiffre d\'affaires', value: `${stats.total_revenue} DH`, icon: <DollarSign size={24}/>, color: 'bg-purple-500' },
    ];

    // --- 3. Configuration dyal l-Graphique ---
    const chartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [
            {
                label: 'Ventes Hebdomadaires (DH)',
                data: [1200, 1900, 1500, 2500, 2200, 3000, 2800], // Ghadi n-rbtouhom m3a l-Backend mn ba3d
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="p-8 ml-64 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de Bord - Statistiques</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`${card.color} p-3 rounded-lg text-white`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- 4. Hna f-blasset l-Placeholder, drna l-Graphique dyal s-se7 --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-700 mb-4 font-sans">Analyse des Ventes</h2>
                <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;