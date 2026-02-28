<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class StockAlertController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(): JsonResponse
    {
        $lowStockProducts = $this->productService->getLowStockProducts();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($lowStockProducts),
            'count' => $lowStockProducts->count()
        ]);
    }
}
