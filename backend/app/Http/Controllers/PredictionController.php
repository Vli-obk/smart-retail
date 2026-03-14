<?php

namespace App\Http\Controllers;

use App\Models\Prediction;
use Illuminate\Http\JsonResponse;

class PredictionController extends Controller
{
    /**
     * Display a listing of predictions
     */
    public function index(): JsonResponse
    {
        try {
            $predictions = Prediction::with('product:id,name')
                ->select('id', 'product_id', 'predicted_demand', 'confidence_score', 'prediction_date')
                ->orderBy('confidence_score', 'desc')
                ->orderBy('prediction_date', 'desc')
                ->get()
                ->map(function ($prediction) {
                    return [
                        'id' => $prediction->id,
                        'product_name' => $prediction->product->name,
                        'predicted_demand' => $prediction->predicted_demand,
                        'confidence_score' => $prediction->confidence_score,
                        'prediction_date' => $prediction->prediction_date
                    ];
                });

            return response()->json($predictions);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }
}
