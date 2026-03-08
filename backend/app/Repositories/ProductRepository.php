<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    public function all(array $filters = [])
    {
        $q = Product::with('category');
        if (!empty($filters['category_id'])) $q->where('category_id', $filters['category_id']);
        if (!empty($filters['search'])) {
            $q->where(function($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                  ->orWhere('reference', 'like', '%'.$filters['search'].'%');
            });
        }
        return $q->get();
    }
    public function find($id) { return Product::with('category')->findOrFail($id); }
    public function create(array $data) { return Product::create($data); }
    public function update(Product $p, array $data) { $p->update($data); return $p->load('category'); }
    public function delete(Product $p) { return $p->delete(); }
    public function decrement(Product $p, int $qty) { $p->decrement('stock_quantity', $qty); return $p->fresh(); }
    public function increment(Product $p, int $qty) { $p->increment('stock_quantity', $qty); return $p->fresh(); }
    public function countLowStock() { return Product::whereColumn('stock_quantity', '<', 'stock_min')->count(); }
    public function countOverstock() { return Product::whereColumn('stock_quantity', '>', 'stock_max')->count(); }
}
