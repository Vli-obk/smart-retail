<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@smartretail.com', // Had email huway bach ghat-dkhal nti dima
            'password' => Hash::make('admin123'), // Had password khtarih nti
            'role' => 'admin', // Darouri i-koun admin
        ]);
    }
}