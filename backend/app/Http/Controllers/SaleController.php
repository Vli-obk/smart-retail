<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Http\Resources\SaleResource;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;

class SaleController extends Controller
{
    protected SaleService $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index(): JsonResponse
    {
        $sales = $this->saleService->getAllSales();

        return response()->json([
            'success' => true,
            'data' => SaleResource::collection($sales),
            'pagination' => [
                'total' => $sales->total(),
                'per_page' => $sales->perPage(),
                'current_page' => $sales->currentPage(),
                'last_page' => $sales->lastPage()
            ]
        ]);
    }

  // app/Http/Controllers/SaleController.php

public function store(Request $request) {
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $product = \App\Models\Product::find($request->product_id);

    // T2kked men l-stock
    if ($product->stock < $request->quantity) {
        return response()->json(['message' => 'Stock insuffisant'], 422);
    }

    // Séjjel l-vente
    $sale = \App\Models\Sale::create([
        'product_id' => $request->product_id,
        'quantity' => $request->quantity,
        'total_price' => $product->price * $request->quantity,
        'sale_date' => now(),
    ]);

    // N9ess men l-stock dyal l-produit
    $product->decrement('stock', $request->quantity);

    return response()->json(['message' => 'Vente enregistrée', 'data' => $sale]);
}
    public function show(int $id): JsonResponse
    {
        $sale = $this->saleService->getSaleById($id);

        if (!$sale) {
            return response()->json([
                'success' => false,
                'message' => 'Sale not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new SaleResource($sale)
        ]);
    }

    public function getByProduct(int $productId): JsonResponse
    {
        $sales = $this->saleService->getSalesByProduct($productId);

        return response()->json([
            'success' => true,
            'data' => SaleResource::collection($sales)
        ]);
    }

    public function getByDateRange($startDate, $endDate): JsonResponse
    {
        try {
            $sales = $this->saleService->getSalesByDateRange($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => SaleResource::collection($sales)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid date range format'
            ], 400);
        }
    }
}
