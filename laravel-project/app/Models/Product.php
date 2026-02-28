<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name', 
        'reference',
        'price',
        'stock_quantity',
        'stock_min',
        'stock_max'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'stock_min' => 'integer',
        'stock_max' => 'integer'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    public function isLowStock()
    {
        return $this->stock_quantity <= $this->stock_min;
    }

    public function isOverstock()
    {
        return $this->stock_quantity > $this->stock_max;
    }

    public function hasSufficientStock(int $quantity): bool
    {
        return $this->stock_quantity >= $quantity;
    }
}
