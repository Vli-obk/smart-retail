<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockAlertController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Public Routes (Bla Login)
|--------------------------------------------------------------------------
*/
// Had l-ster khrejnah l-berra bach React i-qder i-jib l-arqam bla 401 Unauthorized
Route::get('dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/users', [UserController::class, 'index']);
 Route::post('users', [UserController::class, 'store']);
 
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
    Route::get('me', [AuthController::class, 'me'])->middleware('jwt.auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('jwt.auth');
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Khasshoum JWT Token)
|--------------------------------------------------------------------------
*/
Route::middleware('jwt.auth')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::get('products/search', [ProductController::class, 'search']);
    
    Route::apiResource('categories', CategoryController::class)->except(['show']);
    
    Route::apiResource('sales', SaleController::class)->only(['index', 'show', 'store']);
    Route::get('sales/product/{productId}', [SaleController::class, 'getByProduct']);
    Route::get('sales/date-range/{startDate}/{endDate}', [SaleController::class, 'getByDateRange']);
    
    Route::get('stock-movements', [StockMovementController::class, 'index']);
    Route::post('stock-movements', [StockMovementController::class, 'store']);
    
    Route::get('stock-alerts', [StockAlertController::class, 'index']);
    Route::get('stock-alerts/low-stock', [StockAlertController::class, 'getLowStockProducts']);
    
    
   
});