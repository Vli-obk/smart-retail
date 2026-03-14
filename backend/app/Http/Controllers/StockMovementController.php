<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;

class StockMovementController extends Controller
{
    /**
     * Display a listing of stock movements
     */
    public function index(): JsonResponse
    {
        try {
            $movements = StockMovement::with([
                'product:id,name',
                'order:id,status',
                'createdBy:id,name'
            ])
                ->select('id', 'product_id', 'order_id', 'type', 'quantity', 'note', 'created_by', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($movement) {
                    return [
                        'id' => $movement->id,
                        'product_name' => $movement->product->name,
                        'order_id' => $movement->order_id,
                        'order_status' => $movement->order ? $movement->order->status : null,
                        'type' => $movement->type,
                        'quantity' => $movement->quantity,
                        'note' => $movement->note,
                        'created_by' => $movement->createdBy->name,
                        'created_at' => $movement->created_at
                    ];
                });

            return response()->json($movements);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }
}