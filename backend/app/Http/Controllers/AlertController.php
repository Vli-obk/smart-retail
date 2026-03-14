<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    /**
     * Display a listing of unresolved alerts
     */
    public function index(): JsonResponse
    {
        try {
            $alerts = Alert::with('product:id,name')
                ->where('resolved', false)
                ->select('id', 'product_id', 'type', 'current_quantity', 'threshold', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($alert) {
                    $severity = 'warning';
                    if ($alert->current_quantity == 0) {
                        $severity = 'critical';
                    } elseif ($alert->current_quantity < $alert->threshold / 2) {
                        $severity = 'high';
                    }

                    return [
                        'id' => $alert->id,
                        'product_name' => $alert->product->name,
                        'current_quantity' => $alert->current_quantity,
                        'threshold' => $alert->threshold,
                        'severity' => $severity,
                        'created_at' => $alert->created_at
                    ];
                });

            return response()->json($alerts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Resolve an alert
     */
    public function resolve($id): JsonResponse
    {
        try {
            $alert = Alert::findOrFail($id);
            $alert->resolve();

            return response()->json([
                'id' => $alert->id,
                'resolved' => $alert->resolved,
                'updated_at' => $alert->updated_at
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Alert not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }
}
