<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'price',
        'quantity',
        'min_threshold',
        'description'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'min_threshold' => 'integer'
    ];

    // Relationships
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function alerts()
    {
        return $this->hasMany(Alert::class);
    }

    public function predictions()
    {
        return $this->hasMany(Prediction::class);
    }

    // Methods
    public function isLowStock()
    {
        return $this->quantity <= $this->min_threshold;
    }

    public function hasSufficientStock(int $quantity): bool
    {
        return $this->quantity >= $quantity;
    }

    public function decreaseStock(int $quantity)
    {
        $this->quantity -= $quantity;
        $this->save();
    }

    public function increaseStock(int $quantity)
    {
        $this->quantity += $quantity;
        $this->save();
    }
}
