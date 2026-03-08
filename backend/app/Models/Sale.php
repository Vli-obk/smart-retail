<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
        'sale_date'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'quantity' => 'integer',
        'sale_date' => 'date'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
