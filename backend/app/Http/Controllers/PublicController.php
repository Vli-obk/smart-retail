<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    /**
     * Get public stats for home page
     */
    public function stats(): JsonResponse
    {
        try {
            $totalProducts = Product::count();
            $totalClients = User::where('role', 'client')->count();
            $totalOrders = Order::where('status', 'approved')->count();
            $totalRevenue = Order::where('status', 'approved')->sum('total_amount');

            return response()->json([
                'success' => true,
                'data' => [
                    'total_products' => $totalProducts,
                    'total_clients' => $totalClients,
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Get features list
     */
    public function features(): JsonResponse
    {
        try {
            $features = [
                [
                    'id' => 1,
                    'title' => 'Gestion des Stocks',
                    'description' => 'Suivez vos produits en temps réel avec alertes de stock faible',
                    'icon' => 'Package'
                ],
                [
                    'id' => 2,
                    'title' => 'Gestion des Commandes',
                    'description' => 'Gérez les commandes clients avec approbation en un clic',
                    'icon' => 'ShoppingCart'
                ],
                [
                    'id' => 3,
                    'title' => 'Prédictions IA',
                    'description' => 'Anticipez la demande grâce à notre intelligence artificielle',
                    'icon' => 'Brain'
                ],
                [
                    'id' => 4,
                    'title' => 'Tableau de Bord',
                    'description' => 'Visualisez vos performances avec des graphiques détaillés',
                    'icon' => 'BarChart3'
                ],
                [
                    'id' => 5,
                    'title' => 'Multi-Rôles',
                    'description' => 'Admin, Gestionnaire et Client avec accès adaptés',
                    'icon' => 'Users'
                ],
                [
                    'id' => 6,
                    'title' => 'Alertes en Temps Réel',
                    'description' => 'Recevez des notifications pour les stocks critiques',
                    'icon' => 'Bell'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $features
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Get about page info
     */
    public function about(): JsonResponse
    {
        try {
            $about = [
                'company_name' => 'SmartRetail',
                'description' => 'SmartRetail est une solution complète de gestion de stock et de commandes pour les commerces de détail.',
                'mission' => 'Simplifier la gestion des stocks grâce à l\'intelligence artificielle',
                'values' => [
                    'Innovation',
                    'Efficacité',
                    'Fiabilité',
                    'Accessibilité'
                ],
                'founded_year' => 2024,
                'team_size' => 5
            ];

            return response()->json([
                'success' => true,
                'data' => $about
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error'
            ], 500);
        }
    }
}
