<?php
$user = \App\Models\User::where('email', 'smartadmin@retail.com')->first();
if ($user) {
    if ($user->status !== 'active') {
        $user->status = 'active';
        $user->save();
        echo "User '{$user->email}' activated successfully.\n";
    } else {
        echo "User '{$user->email}' is already active.\n";
    }
} else {
    echo "User not found.\n";
}
