<?php
$user = \App\Models\User::where('email', 'some-email-here')->first(); // We'll look for both
$admin1 = \App\Models\User::where('email', 'admin@retail.com')->first();
$admin2 = \App\Models\User::where('email', 'smartadmin@retail.com')->first();

echo "--- Admin Check ---\n";
if ($admin1) {
    echo "Found admin@retail.com: [Role: {$admin1->role}, Status: {$admin1->status}]\n";
} else {
    echo "admin@retail.com: NOT FOUND\n";
}

if ($admin2) {
    echo "Found smartadmin@retail.com: [Role: {$admin2->role}, Status: {$admin2->status}]\n";
} else {
    echo "smartadmin@retail.com: NOT FOUND\n";
}
echo "-------------------\n";
