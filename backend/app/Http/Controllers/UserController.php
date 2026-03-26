<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'stock_manager')->get();
        return response()->json([
            'success' => true, 
            'data' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        // Force role to stock_manager - admin can only create stock managers
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'stock_manager',
            'status' => $request->status ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stock manager created successfully',
            'data' => $user
        ]);
    }

    public function show($id)
    {
        $user = User::where('role', 'stock_manager')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('role', 'stock_manager')->findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|min:6',
            'status' => 'sometimes|in:active,inactive,en_attente',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Keep role as stock_manager - admin cannot change it
        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Stock manager updated successfully',
            'data' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::where('role', 'stock_manager')->findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Stock manager deleted successfully'
        ]);
    }
}