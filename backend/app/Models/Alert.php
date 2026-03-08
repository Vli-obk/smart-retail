<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = ['product_id', 'type', 'message', 'is_resolved'];

    protected $casts = ['is_resolved' => 'boolean'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
