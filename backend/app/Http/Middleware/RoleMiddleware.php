<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Handle multiple roles separated by comma
        $roles = explode(',', $role);
        $hasRequiredRole = false;

        foreach ($roles as $r) {
            $r = trim($r);
            switch ($r) {
                case 'admin':
                    if ($user->isAdmin()) {
                        $hasRequiredRole = true;
                    }
                    break;
                case 'stock_manager':
                    if ($user->isStockManager()) {
                        $hasRequiredRole = true;
                    }
                    break;
                case 'client':
                    if ($user->isClient()) {
                        $hasRequiredRole = true;
                    }
                    break;
            }
        }

        if (!$hasRequiredRole) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Insufficient permissions'
            ], 403);
        }

        return $next($request);
    }
}
