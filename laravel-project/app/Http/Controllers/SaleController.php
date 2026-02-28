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

    public function store(StoreSaleRequest $request): JsonResponse
    {
        try {
            $sale = $this->saleService->createSale($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Sale recorded successfully',
                'data' => new SaleResource($sale)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
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
