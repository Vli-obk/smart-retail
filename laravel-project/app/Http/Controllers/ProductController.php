<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private ProductService $service) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category_id', 'search']);
        $products = $this->service->getAll($filters);

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products)
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->service->create($request->validated());
        return response()->json([
            'success' => true, 
            'data' => new ProductResource($product->load('category'))
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $product = $this->service->getById($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true, 
            'data' => new ProductResource($product->load('category'))
        ]);
    }

    public function update(UpdateProductRequest $request, $id): JsonResponse
    {
        $product = $this->service->getById($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $updatedProduct = $this->service->update($product, $request->validated());
        return response()->json([
            'success' => true, 
            'data' => new ProductResource($updatedProduct->load('category'))
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $product = $this->service->getById($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $this->service->delete($product);
        return response()->json([
            'success' => true, 
            'message' => 'Product deleted successfully'
        ]);
    }
}