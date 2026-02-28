<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAll(array $filters = []): Collection
    {
        return $this->productRepository->all($filters);
    }

    public function getById(int $id): ?\App\Models\Product
    {
        return $this->productRepository->find($id);
    }

    public function create(array $data): \App\Models\Product
    {
        return $this->productRepository->create($data);
    }

    public function update(\App\Models\Product $product, array $data): \App\Models\Product
    {
        return $this->productRepository->update($product, $data);
    }

    public function delete(\App\Models\Product $product): bool
    {
        return $this->productRepository->delete($product);
    }

    public function getTotalProducts(): int
    {
        return $this->productRepository->all()->count();
    }

    public function getLowStockCount(): int
    {
        return $this->productRepository->countLowStock();
    }

    public function getOverstockCount(): int
    {
        return $this->productRepository->countOverstock();
    }

    public function checkStockAvailability(int $productId, int $quantity): bool
    {
        $product = $this->productRepository->find($productId);
        return $product && $product->hasSufficientStock($quantity);
    }

    public function decreaseStock(int $productId, int $quantity): bool
    {
        $product = $this->productRepository->find($productId);
        if ($product && $product->hasSufficientStock($quantity)) {
            $this->productRepository->decrement($product, $quantity);
            return true;
        }
        return false;
    }

    public function increaseStock(int $productId, int $quantity): bool
    {
        $product = $this->productRepository->find($productId);
        if ($product) {
            $this->productRepository->increment($product, $quantity);
            return true;
        }
        return false;
    }
}
