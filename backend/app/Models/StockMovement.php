<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'order_id',
        'type',
        'quantity',
        'note',
        'created_by'
    ];

    protected $casts = [
        'quantity' => 'integer'
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Methods
    public function isIn()
    {
        return $this->type === 'in';
    }

    public function isOut()
    {
        return $this->type === 'out';
    }
}
