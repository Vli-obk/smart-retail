<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    protected $fillable = [
        'product_id',
        'predicted_demand',
        'confidence_score',
        'prediction_date'
    ];

    protected $casts = [
        'predicted_demand' => 'integer',
        'confidence_score' => 'decimal:2',
        'prediction_date' => 'date'
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // Methods
    public function isHighConfidence()
    {
        return $this->confidence_score >= 0.8;
    }

    public function isMediumConfidence()
    {
        return $this->confidence_score >= 0.6 && $this->confidence_score < 0.8;
    }

    public function isLowConfidence()
    {
        return $this->confidence_score < 0.6;
    }
}
