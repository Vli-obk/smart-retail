<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockAlertController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
    Route::get('me', [AuthController::class, 'me'])->middleware('jwt.auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('jwt.auth');
});

Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::get('products/search', [ProductController::class, 'search']);
    
    Route::apiResource('sales', SaleController::class)->only(['index', 'show', 'store']);
    Route::get('sales/product/{productId}', [SaleController::class, 'getByProduct']);
    Route::get('sales/date-range/{startDate}/{endDate}', [SaleController::class, 'getByDateRange']);
    
    Route::get('stock-alerts', [StockAlertController::class, 'index']);
    
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
});
