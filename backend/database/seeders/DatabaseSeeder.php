<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StockMovement;
use App\Models\Alert;
use App\Models\Prediction;
use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing data
        User::truncate();
        Product::truncate();
        Order::truncate();
        OrderItem::truncate();
        StockMovement::truncate();
        Alert::truncate();
        Prediction::truncate();
        Contact::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('Starting Smart Retail database seeding...');

        // 1. Create users
        $this->seedUsers();
        
        // 2. Create products
        $this->seedProducts();
        
        // 3. Create orders and order items
        $this->seedOrders();
        
        // 4. Create stock movements (for approved orders)
        $this->seedStockMovements();
        
        // 5. Create alerts (for products below threshold)
        $this->seedAlerts();
        
        // 6. Create predictions
        $this->seedPredictions();
        
        // 7. Create contacts
        $this->call(ContactSeeder::class);

        $this->command->info('Smart Retail database seeding completed!');
    }

    private function seedUsers()
    {
        $this->command->info('Seeding users...');

        // Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@retail.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active'
        ]);

        // Stock managers
        for ($i = 1; $i <= 2; $i++) {
            User::create([
                'name' => "Manager {$i}",
                'email' => "manager{$i}@retail.com",
                'password' => Hash::make('manager123'),
                'role' => 'stock_manager',
                'status' => 'active'
            ]);
        }

        // Clients
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name' => "Client {$i}",
                'email' => "client{$i}@retail.com",
                'password' => Hash::make('client123'),
                'role' => 'client',
                'status' => 'active'
            ]);
        }

        $this->command->info('Users seeded successfully!');
    }

    private function seedProducts()
    {
        $this->command->info('Seeding products...');

        $categories = ['Boissons', 'Produits Laitiers', 'Épicerie', 'Snacks'];
        $products = [
            // Boissons (5 products)
            ['Coca-Cola 2L', 'Boissons', 15.50, 50, 20, 'Boisson gazeuse populaire'],
            ['Jus d\'Orange 1L', 'Boissons', 8.75, 3, 15, 'Jus naturel 100%'],
            ['Eau Minérale 1.5L', 'Boissons', 6.25, 0, 25, 'Eau de source pure'],
            ['Thé Glacé 500ml', 'Boissons', 4.50, 8, 12, 'Thé glacé au citron'],
            ['Soda Citron 330ml', 'Boissons', 3.25, 2, 10, 'Boisson rafraîchissante'],

            // Produits Laitiers (5 products)
            ['Lait 1L', 'Produits Laitiers', 12.00, 25, 15, 'Lait frais entier'],
            ['Yaourt Nature 1kg', 'Produits Laitiers', 18.50, 4, 8, 'Yaourt nature bio'],
            ['Fromage 200g', 'Produits Laitiers', 22.75, 7, 5, 'Fromage au lait cru'],
            ['Beurre 250g', 'Produits Laitiers', 14.25, 12, 8, 'Beurre doux'],
            ['Crème Fraîche 200ml', 'Produits Laitiers', 8.50, 1, 6, 'Crème fraîche épaisse'],

            // Épicerie (5 products)
            ['Riz 1kg', 'Épicerie', 25.00, 30, 20, 'Riz basmati premium'],
            ['Pâtes 500g', 'Épicerie', 8.75, 15, 10, 'Pâtes italiennes'],
            ['Huile d\'Olive 1L', 'Épicerie', 45.50, 6, 8, 'Huile d\'olive vierge'],
            ['Farine 1kg', 'Épicerie', 12.25, 20, 15, 'Farine de blé'],
            ['Sucre 1kg', 'Épicerie', 15.75, 18, 12, 'Sucre blanc'],

            // Snacks (5 products)
            ['Chips 150g', 'Snacks', 7.50, 22, 15, 'Chips pomme de terre'],
            ['Cookies 200g', 'Snacks', 9.25, 9, 8, 'Cookies chocolat'],
            ['Barres Chocolat 100g', 'Snacks', 6.75, 14, 10, 'Barres au chocolat'],
            ['Noix 250g', 'Snacks', 18.50, 3, 6, 'Noix mixtes'],
            ['Popcorn 100g', 'Snacks', 5.25, 11, 8, 'Popcorn micro-ondes']
        ];

        foreach ($products as $product) {
            Product::create([
                'name' => $product[0],
                'category' => $product[1],
                'price' => $product[2],
                'quantity' => $product[3],
                'min_threshold' => $product[4],
                'description' => $product[5]
            ]);
        }

        $this->command->info('Products seeded successfully!');
    }

    private function seedOrders()
    {
        $this->command->info('Seeding orders...');

        $clients = User::where('role', 'client')->get();
        $products = Product::all();
        $statuses = ['pending', 'approved', 'rejected'];
        
        // Create 10 orders with mixed statuses
        for ($i = 1; $i <= 10; $i++) {
            $client = $clients->random();
            $status = $statuses[$i % 3]; // Mix of statuses
            
            $order = Order::create([
                'client_id' => $client->id,
                'status' => $status,
                'total_amount' => 0, // Will be calculated below
                'approved_by' => $status === 'approved' ? User::where('role', 'admin')->first()->id : null
            ]);

            // Add 2-4 order items per order
            $numItems = rand(2, 4);
            $totalAmount = 0;
            $selectedProducts = $products->random($numItems);

            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 5);
                $unitPrice = $product->price;
                $itemTotal = $quantity * $unitPrice;
                $totalAmount += $itemTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice
                ]);
            }

            $order->total_amount = $totalAmount;
            $order->save();
        }

        $this->command->info('Orders seeded successfully!');
    }

    private function seedStockMovements()
    {
        $this->command->info('Seeding stock movements...');

        $approvedOrders = Order::where('status', 'approved')->with('orderItems.product')->get();
        $adminUser = User::where('role', 'admin')->first();

        foreach ($approvedOrders as $order) {
            foreach ($order->orderItems as $orderItem) {
                StockMovement::create([
                    'product_id' => $orderItem->product_id,
                    'order_id' => $order->id,
                    'type' => 'out',
                    'quantity' => $orderItem->quantity,
                    'note' => "Order #{$order->id}",
                    'created_by' => $adminUser->id
                ]);
            }
        }

        $this->command->info('Stock movements seeded successfully!');
    }

    private function seedAlerts()
    {
        $this->command->info('Seeding alerts...');

        // Find products below threshold
        $lowStockProducts = Product::whereColumn('quantity', '<=', 'min_threshold')->get();

        foreach ($lowStockProducts as $product) {
            Alert::create([
                'product_id' => $product->id,
                'type' => 'low_stock',
                'current_quantity' => $product->quantity,
                'threshold' => $product->min_threshold,
                'resolved' => false
            ]);
        }

        $this->command->info('Alerts seeded successfully!');
    }

    private function seedPredictions()
    {
        $this->command->info('Seeding predictions...');

        $products = Product::all();

        foreach ($products->take(5) as $product) {
            Prediction::create([
                'product_id' => $product->id,
                'predicted_demand' => rand(10, 50),
                'confidence_score' => rand(65, 95) / 100, // 0.65 to 0.95
                'prediction_date' => now()->addDays(rand(7, 30))->toDateString()
            ]);
        }

        $this->command->info('Predictions seeded successfully!');
    }
}
