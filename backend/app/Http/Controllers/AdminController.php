<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        try {
            $currentMonth = now()->month;
            $currentYear = now()->year;
            $previousMonth = $currentMonth === 1 ? 12 : $currentMonth - 1;
            $previousYear = $currentMonth === 1 ? $currentYear - 1 : $currentYear;

            // Current stats
            $totalProducts = Product::count();
            $totalClients = User::where('role', 'client')->count();
            $totalOrders = Order::count();
            $totalRevenue = Order::where('status', 'approved')->sum('total_amount');
            $pendingOrders = Order::where('status', 'pending')->count();

            // Previous month stats
            $prevMonthProducts = Product::whereMonth('created_at', $previousMonth)
                ->whereYear('created_at', $previousYear)
                ->count();
            $prevMonthClients = User::where('role', 'client')
                ->whereMonth('created_at', $previousMonth)
                ->whereYear('created_at', $previousYear)
                ->count();
            $prevMonthOrders = Order::whereMonth('created_at', $previousMonth)
                ->whereYear('created_at', $previousYear)
                ->count();
            $prevMonthRevenue = Order::where('status', 'approved')
                ->whereMonth('created_at', $previousMonth)
                ->whereYear('created_at', $previousYear)
                ->sum('total_amount');

            return response()->json([
                'total_products' => $totalProducts,
                'total_clients' => $totalClients,
                'total_orders' => $totalOrders,
                'total_revenue' => $totalRevenue,
                'pending_orders' => $pendingOrders,
                'prev_month_products' => $prevMonthProducts,
                'prev_month_clients' => $prevMonthClients,
                'prev_month_orders' => $prevMonthOrders,
                'prev_month_revenue' => $prevMonthRevenue
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Get chart data for current year
     */
    public function chart(): JsonResponse
    {
        try {
            $currentYear = now()->year;
            
            $monthlyData = Order::where('status', 'approved')
                ->whereYear('created_at', $currentYear)
                ->select(
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('COUNT(*) as sales_count'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy(DB::raw('MONTH(created_at)'))
                ->orderBy('month')
                ->get();

            // Initialize all months with 0 values
            $chartData = [];
            for ($month = 1; $month <= 12; $month++) {
                $chartData[] = [
                    'month' => $month,
                    'sales_count' => 0,
                    'revenue' => 0
                ];
            }

            // Fill with actual data
            foreach ($monthlyData as $data) {
                $chartData[$data->month - 1] = [
                    'month' => $data->month,
                    'sales_count' => $data->sales_count,
                    'revenue' => (float) $data->revenue
                ];
            }

            return response()->json($chartData);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Get all clients
     */
    public function clients(): JsonResponse
    {
        try {
            $clients = User::where('role', 'client')
                ->select('id', 'name', 'email', 'status', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($clients);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Toggle client status
     */
    public function toggleClient($id): JsonResponse
    {
        try {
            $client = User::where('role', 'client')->findOrFail($id);
            
            $client->status = $client->status === 'active' ? 'inactive' : 'active';
            $client->save();

            return response()->json([
                'id' => $client->id,
                'status' => $client->status
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Client not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Manager dashboard stats
     */
    public function managerStats(): JsonResponse
    {
        $now = now();
        $prevMonth = now()->subMonth(); // separate variable — never mutate $now

        return response()->json([
            'total_products'      => Product::count(),
            'total_orders'        => Order::where('status', 'approved')->count(),
            'total_revenue'       => Order::where('status', 'approved')->sum('total_amount'),
            'total_clients'       => User::where('role', 'client')->count(),
            'pending_orders'      => Order::where('status', 'pending')->count(),

            'prev_month_products' => Product::whereYear('created_at', $prevMonth->year)
                                        ->whereMonth('created_at', $prevMonth->month)->count(),
            'prev_month_orders'   => Order::where('status', 'approved')
                                        ->whereYear('created_at', $prevMonth->year)
                                        ->whereMonth('created_at', $prevMonth->month)->count(),
            'prev_month_revenue'  => Order::where('status', 'approved')
                                        ->whereYear('created_at', $prevMonth->year)
                                        ->whereMonth('created_at', $prevMonth->month)->sum('total_amount'),
            'prev_month_clients'  => User::where('role', 'client')
                                        ->whereYear('created_at', $prevMonth->year)
                                        ->whereMonth('created_at', $prevMonth->month)->count(),
        ]);
    }
}
