<?php
$admin = \App\Models\User::where('role', 'admin')->first();
if ($admin) {
    $admin->email = 'smartadmin@retail.com';
    $admin->password = \Illuminate\Support\Facades\Hash::make('admin@2024');
    $admin->save();
    echo "Admin credentials updated successfully.\n";
} else {
    echo "Admin user not found.\n";
}
