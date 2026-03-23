<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\PublicController;

/*
|--------------------------------------------------------------------------
| Apply CORS Middleware Globally
|--------------------------------------------------------------------------
*/

Route::middleware(['cors'])->group(function () {

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public pages (no auth required)
Route::get('/public/stats', [PublicController::class, 'stats']);
Route::get('/public/features', [PublicController::class, 'features']);
Route::get('/public/about', [PublicController::class, 'about']);

// Contact form (public - anyone can send)
Route::post('/contact', [ContactController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    
        // Logout
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        
        // Test endpoint
        Route::get('/test', function () {
            return response()->json(['message' => 'Test endpoint works!']);
        });
        
        /*
        |--------------------------------------------------------------------------
        | Admin Only Routes
        |--------------------------------------------------------------------------
        */
        
        Route::middleware('admin')->prefix('/admin')->group(function () {
            Route::get('/dashboard/stats', [AdminController::class, 'stats']);
            Route::get('/dashboard/chart', [AdminController::class, 'chart']);
            Route::get('/clients', [AdminController::class, 'clients']);
            Route::put('/clients/{id}/toggle', [AdminController::class, 'toggleClient']);
            
            // Contact management (admin only)
            Route::get('/contacts', [ContactController::class, 'index']);
            Route::put('/contacts/{id}/status', [ContactController::class, 'updateStatus']);
            Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
        });
        
        /*
        |--------------------------------------------------------------------------
        | Admin + Stock Manager Routes
        |--------------------------------------------------------------------------
        */
        
        Route::middleware('admin_or_manager')->group(function () {
            // Test endpoint
            Route::get('/manager-test', function () {
                return response()->json(['message' => 'Admin or Stock Manager access granted!']);
            });
            
            // Users (Gestionnaires)
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
            
            // Products
            Route::get('/products', [ProductController::class, 'index']);
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{id}', [ProductController::class, 'update']);
            Route::delete('/products/{id}', [ProductController::class, 'destroy']);
            
            // Orders
            Route::get('/orders', [OrderController::class, 'index']);
            Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
            
            // Stock Movements
            Route::get('/stock-movements', [StockMovementController::class, 'index']);
            
            // Alerts
            Route::get('/alerts', [AlertController::class, 'index']);
            Route::put('/alerts/{id}/resolve', [AlertController::class, 'resolve']);
            
            // Predictions
            Route::get('/predictions', [PredictionController::class, 'index']);
            
            // Manager Dashboard
            Route::get('/manager/dashboard/stats', [AdminController::class, 'managerStats']);
        });
        
        /*
        |--------------------------------------------------------------------------
        | Client Only Routes
        |--------------------------------------------------------------------------
        */
        
        Route::middleware('client')->group(function () {
            // Products (read only)
            Route::get('/client/products', [ProductController::class, 'index']);
            
            // Orders
            Route::post('/orders', [OrderController::class, 'store']);
            Route::get('/client/orders', [OrderController::class, 'clientOrders']);
        });
    });
});