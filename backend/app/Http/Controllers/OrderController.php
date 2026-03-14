<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(): JsonResponse
    {
        try {
            $user = request()->user();
            
            $query = Order::with(['client:id,name,email', 'orderItems.product:id,name,price'])
                ->select('id', 'client_id', 'status', 'total_amount', 'approved_by', 'created_at');

            // Client can only see their own orders
            if ($user->isClient()) {
                $query->where('client_id', $user->id);
            }

            $orders = $query->orderBy('created_at', 'desc')->get();

            $formattedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'client_name' => $order->client->name,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price
                        ];
                    }),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at
                ];
            });

            return response()->json($formattedOrders);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Store a newly created order
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user = $request->user();
            $items = $request->items;
            $totalAmount = 0;
            $orderItems = [];

            // Calculate total amount and validate stock
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if (!$product->hasSufficientStock($item['quantity'])) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Insufficient stock for product: {$product->name}"
                    ], 422);
                }

                $itemTotal = $product->price * $item['quantity'];
                $totalAmount += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price
                ];
            }

            // Create order
            $order = Order::create([
                'client_id' => $user->id,
                'status' => 'pending',
                'total_amount' => $totalAmount
            ]);

            // Create order items
            foreach ($orderItems as $orderItem) {
                $orderItem['order_id'] = $order->id;
                OrderItem::create($orderItem);
            }

            DB::commit();

            return response()->json([
                'id' => $order->id,
                'client_id' => $order->client_id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'created_at' => $order->created_at
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $order = Order::with('orderItems.product')->findOrFail($id);
            $user = $request->user();
            $newStatus = $request->status;

            if ($order->status !== 'pending') {
                DB::rollBack();
                return response()->json([
                    'message' => 'Order cannot be updated'
                ], 422);
            }

            $order->status = $newStatus;

            if ($newStatus === 'approved') {
                $order->approved_by = $user->id;

                // Process each order item
                foreach ($order->orderItems as $orderItem) {
                    $product = $orderItem->product;

                    // Decrease product quantity
                    $product->decreaseStock($orderItem->quantity);

                    // Create stock movement
                    StockMovement::create([
                        'product_id' => $product->id,
                        'order_id' => $order->id,
                        'type' => 'out',
                        'quantity' => $orderItem->quantity,
                        'note' => "Order #{$order->id}",
                        'created_by' => $user->id
                    ]);

                    // Check if product is below threshold and create alert
                    if ($product->isLowStock()) {
                        $existingAlert = Alert::where('product_id', $product->id)
                            ->where('resolved', false)
                            ->first();

                        if (!$existingAlert) {
                            Alert::create([
                                'product_id' => $product->id,
                                'type' => 'low_stock',
                                'current_quantity' => $product->quantity,
                                'threshold' => $product->min_threshold,
                                'resolved' => false
                            ]);
                        }
                    }
                }
            }

            $order->save();
            DB::commit();

            return response()->json([
                'id' => $order->id,
                'status' => $order->status,
                'approved_by' => $order->approved_by,
                'updated_at' => $order->updated_at
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }

    /**
     * Get client's own orders
     */
    public function clientOrders(): JsonResponse
    {
        try {
            $user = request()->user();
            
            $orders = Order::with(['orderItems.product:id,name,price'])
                ->where('client_id', $user->id)
                ->select('id', 'status', 'total_amount', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price
                        ];
                    }),
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at
                ];
            });

            return response()->json($formattedOrders);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error'
            ], 500);
        }
    }
}
