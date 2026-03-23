<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

class ExtraDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Adding extra products...');
        
        // Add 10 more products
        $categories = ['Boissons', 'Épicerie', 'Snacks', 'Produits Laitiers'];
        for ($i = 1; $i <= 10; $i++) {
            Product::create([
                'name' => 'Produit Premium ' . $i,
                'category' => $categories[array_rand($categories)],
                'price' => rand(25, 150),
                'quantity' => rand(30, 200),
                'min_threshold' => 15,
                'description' => 'Produit de haute qualité'
            ]);
        }
        
        $this->command->info('Adding extra orders with high revenue...');
        
        // Add 20 more approved orders
        $clients = User::where('role', 'client')->get();
        $admin = User::where('role', 'admin')->first();
        $products = Product::all();
        
        for ($i = 1; $i <= 20; $i++) {
            $orderTotal = rand(200, 800);
            $order = Order::create([
                'client_id' => $clients->random()->id,
                'status' => 'approved',
                'total_amount' => $orderTotal,
                'approved_by' => $admin->id,
                'created_at' => now()->subDays(rand(1, 60))
            ]);
            
            // Add 2-3 items per order
            $numItems = rand(2, 3);
            $selectedProducts = $products->random($numItems);
            
            foreach ($selectedProducts as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(2, 8),
                    'unit_price' => $product->price
                ]);
            }
        }
        
        $this->command->info('Extra data added successfully!');
        $this->command->info('Total Products: ' . Product::count());
        $this->command->info('Total Orders: ' . Order::count());
        $this->command->info('Total Revenue: ' . Order::where('status', 'approved')->sum('total_amount') . ' DH');
    }
}
