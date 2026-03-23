<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class StockManagerController extends Controller
{
    /**
     * Get stock manager dashboard stats
     */
    public function stats(): JsonResponse
    {
        try {
            $totalProducts = Product::count();
            $pendingOrders = Order::where('status', 'pending')->count();
            $totalRevenue = Order::where('status', 'approved')->sum('total_amount');
            $lowStockCount = Product::whereColumn('quantity', '<=', 'min_threshold')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_products' => $totalProducts,
                    'pending_orders' => $pendingOrders,
                    'total_revenue' => $totalRevenue,
                    'low_stock_count' => $lowStockCount
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
     * Get predictions for stock management
     */
    public function predictions(): JsonResponse
    {
        try {
            $products = Product::select('id', 'name', 'quantity')->get();
            
            $predictions = $products->map(function ($product) {
                $predictedDemand = rand(10, 50);
                
                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'current_stock' => $product->quantity,
                    'predicted_demand' => $predictedDemand,
                    'recommendation' => $predictedDemand > $product->quantity ? 'restock' : 'ok'
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $predictions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error'
            ], 500);
        }
    }
}
