<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use App\Repositories\SaleRepository;
use Illuminate\Database\Eloquent\Collection;

class DashboardService
{
    protected ProductRepository $productRepository;
    protected SaleRepository $saleRepository;

    public function __construct(ProductRepository $productRepository, SaleRepository $saleRepository)
    {
        $this->productRepository = $productRepository;
        $this->saleRepository = $saleRepository;
    }

    public function getDashboardStats(): array
    {
        return [
            'total_products' => $this->getTotalProducts(),
            'total_sales' => $this->getTotalSales(),
            'total_revenue' => $this->getTotalRevenue(),
            'low_stock_count' => $this->getLowStockCount(),
            'top_selling_products' => $this->getTopSellingProducts()
        ];
    }

    public function getTotalProducts(): int
    {
        return $this->productRepository->getTotalCount();
    }

    public function getTotalSales(): int
    {
        return $this->saleRepository->getTotalSales();
    }

    public function getTotalRevenue(): float
    {
        return $this->saleRepository->getTotalRevenue();
    }

    public function getLowStockCount(): int
    {
        return $this->productRepository->getLowStockProducts()->count();
    }

    public function getTopSellingProducts(int $limit = 5): Collection
    {
        return $this->productRepository->getTopSellingProducts($limit);
    }

    public function getLowStockProducts(): Collection
    {
        return $this->productRepository->getLowStockProducts();
    }
}
