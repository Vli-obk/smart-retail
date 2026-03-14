<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(): JsonResponse
    {
        try {
            $products = Product::select('id', 'name', 'category', 'price', 'quantity', 'min_threshold')
                ->orderBy('name')
                ->get();

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'min_threshold' => 'required|integer|min:0',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::create($request->all());

            return response()->json([
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price,
                'quantity' => $product->quantity,
                'min_threshold' => $product->min_threshold,
                'description' => $product->description
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'quantity' => 'sometimes|required|integer|min:0',
            'min_threshold' => 'sometimes|required|integer|min:0',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::findOrFail($id);
            $product->update($request->all());

            return response()->json([
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price,
                'quantity' => $product->quantity,
                'min_threshold' => $product->min_threshold,
                'description' => $product->description
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Remove the specified product
     */
    public function destroy($id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            // Check if product has pending orders
            $hasPendingOrders = Order::whereHas('orderItems', function ($query) use ($id) {
                $query->where('product_id', $id);
            })->where('status', 'pending')->exists();

            if ($hasPendingOrders) {
                return response()->json([
                    'message' => 'Cannot delete product with pending orders'
                ], 422);
            }

            $product->delete();

            return response()->json(null, 204);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }
}