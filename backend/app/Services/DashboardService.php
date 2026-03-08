<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;

class DashboardService
{
    public function getDashboardStats(): array
    {
        return [
            'total_products' => \App\Models\Product::count(),
            'total_sales'    => \App\Models\Sale::count(),
            'total_revenue'  => \App\Models\Sale::sum('total_price') ?? 0,
            // Hada houwa l-ster li beddelna:
            'total_clients'  => \App\Models\User::count(), 
            'low_stock_count'=> \App\Models\Product::where('current_stock', '<', 10)->count(),
            'top_selling_products' => \App\Models\Product::limit(5)->get()
        ];
    }

    public function getLowStockProducts(): Collection
    {
        return \App\Models\Product::where('current_stock', '<', 10)->get();
    }
}