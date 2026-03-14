<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10|max:2000',
        ]);

        // Create contact with authenticated user if available
        $contact = Contact::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully! We will get back to you soon.',
            'data' => $contact
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        // Only admins can view all contacts
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $contacts = Contact::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        // Only admins can update contact status
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,resolved',
        ]);

        $contact = Contact::findOrFail($id);
        $contact->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Contact status updated successfully',
            'data' => $contact
        ]);
    }

    public function destroy($id): JsonResponse
    {
        // Only admins can delete contacts
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact deleted successfully'
        ]);
    }
}
