<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = [
        'product_id',
        'type',
        'current_quantity',
        'threshold',
        'resolved'
    ];

    protected $casts = [
        'current_quantity' => 'integer',
        'threshold' => 'integer',
        'resolved' => 'boolean'
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Methods
    public function isLowStock()
    {
        return $this->type === 'low_stock';
    }

    public function resolve()
    {
        $this->resolved = true;
        $this->save();
    }

    public function reopen()
    {
        $this->resolved = false;
        $this->save();
    }
}
