<?php

namespace App\Repositories;

use App\Models\Sale;
use Illuminate\Database\Eloquent\Collection;

class SaleRepository
{
    public function all(array $filters = []): Collection
    {
        $query = Sale::with('product')->orderBy('sale_date', 'desc');
        
        if (!empty($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }
        
        if (!empty($filters['date_from'])) {
            $query->where('sale_date', '>=', $filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $query->where('sale_date', '<=', $filters['date_to']);
        }
        
        return $query->get();
    }

    public function find(int $id): ?Sale
    {
        return Sale::with('product')->find($id);
    }

    public function create(array $data): Sale
    {
        return Sale::create($data);
    }

    public function getTotalRevenue(): float
    {
        return Sale::sum('total_price');
    }

    public function getTotalSales(): int
    {
        return Sale::sum('quantity');
    }

    public function getSalesByDateRange($startDate, $endDate): Collection
    {
        return Sale::with('product')
                  ->whereBetween('sale_date', [$startDate, $endDate])
                  ->orderBy('sale_date', 'desc')
                  ->get();
    }

    public function getSalesByProduct(int $productId): Collection
    {
        return Sale::with('product')
                  ->where('product_id', $productId)
                  ->orderBy('sale_date', 'desc')
                  ->get();
    }
}