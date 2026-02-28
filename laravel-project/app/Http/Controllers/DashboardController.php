<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function stats(): JsonResponse
    {
        $stats = $this->dashboardService->getDashboardStats();

        return response()->json([
            'success' => true,
            'data' => [
                'total_products' => $stats['total_products'],
                'total_sales' => $stats['total_sales'],
                'total_revenue' => $stats['total_revenue'],
                'low_stock_count' => $stats['low_stock_count'],
                'top_selling_products' => ProductResource::collection($stats['top_selling_products'])
            ]
        ]);
    }
}
