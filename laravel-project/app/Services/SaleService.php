<?php

namespace App\Services;

use App\Repositories\SaleRepository;
use App\Repositories\ProductRepository;
use App\Repositories\StockMovementRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class SaleService
{
    protected SaleRepository $saleRepository;
    protected ProductRepository $productRepository;
    protected StockMovementRepository $stockMovementRepository;

    public function __construct(
        SaleRepository $saleRepository, 
        ProductRepository $productRepository,
        StockMovementRepository $stockMovementRepository
    ) {
        $this->saleRepository = $saleRepository;
        $this->productRepository = $productRepository;
        $this->stockMovementRepository = $stockMovementRepository;
    }

    public function getAll(array $filters = []): Collection
    {
        return $this->saleRepository->all($filters);
    }

    public function getSaleById(int $id): ?\App\Models\Sale
    {
        return $this->saleRepository->find($id);
    }

    public function create(array $data): \App\Models\Sale
    {
        return DB::transaction(function () use ($data) {
            $product = $this->productRepository->find($data['product_id']);
            
            if (!$product) {
                throw new \Exception('Product not found');
            }

            if (!$product->hasSufficientStock($data['quantity'])) {
                throw new \Exception('Insufficient stock available');
            }

            $totalPrice = $product->price * $data['quantity'];
            
            $saleData = [
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
                'unit_price' => $product->price,
                'total_price' => $totalPrice,
                'sale_date' => $data['sale_date'] ?? now()->toDateString()
            ];

            $sale = $this->saleRepository->create($saleData);
            
            // Decrease stock
            $this->productRepository->decrement($product, $data['quantity']);
            
            // Create stock movement
            $this->stockMovementRepository->create([
                'product_id' => $data['product_id'],
                'type' => 'out',
                'quantity' => $data['quantity'],
                'reason' => 'Sale #' . $sale->id
            ]);

            return $sale->load('product');
        });
    }

    public function getTotalRevenue(): float
    {
        return $this->saleRepository->getTotalRevenue();
    }

    public function getTotalSales(): int
    {
        return $this->saleRepository->getTotalSales();
    }

    public function getSalesByDateRange($startDate, $endDate): Collection
    {
        return $this->saleRepository->getSalesByDateRange($startDate, $endDate);
    }

    public function getSalesByProduct(int $productId): Collection
    {
        return $this->saleRepository->getSalesByProduct($productId);
    }
}