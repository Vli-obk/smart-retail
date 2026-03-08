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
        $users = User::all();
        return response()->json([
            'success' => true, 
            'data' => $users
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validation
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        // 2. Creation dyal l-user b status 'en attente'
        // Hada houwa l-logique dyal PFE bach l-admin i-valider
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'status' => 'en attente', 
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demande d\'inscription envoyée avec succès',
            'data' => $user
        ]);
    }
}