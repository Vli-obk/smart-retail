<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Coca-Cola 2L',
                'category' => 'Boissons',
                'price' => 15.50,
                'quantity' => 100,
                'min_threshold' => 10,
                'description' => 'Boisson gazeuse'
            ],
            [
                'name' => 'Jus d\'Orange 1L',
                'category' => 'Boissons',
                'price' => 8.75,
                'quantity' => 80,
                'min_threshold' => 8,
                'description' => 'Jus naturel'
            ],
            [
                'name' => 'Lait 1L',
                'category' => 'Produits laitiers',
                'price' => 6.50,
                'quantity' => 50,
                'min_threshold' => 5,
                'description' => 'Lait entier'
            ],
            [
                'name' => 'Fromage 200g',
                'category' => 'Produits laitiers',
                'price' => 24.00,
                'quantity' => 30,
                'min_threshold' => 3,
                'description' => 'Fromage affiné'
            ],
            [
                'name' => 'Pain complet',
                'category' => 'Boulangerie',
                'price' => 3.50,
                'quantity' => 40,
                'min_threshold' => 5,
                'description' => 'Pain frais'
            ],
            [
                'name' => 'Riz 5kg',
                'category' => 'Épicerie',
                'price' => 45.00,
                'quantity' => 60,
                'min_threshold' => 6,
                'description' => 'Riz basmati'
            ],
            [
                'name' => 'Huile d\'olive 1L',
                'category' => 'Épicerie',
                'price' => 35.00,
                'quantity' => 45,
                'min_threshold' => 5,
                'description' => 'Huile vierge extra'
            ],
            [
                'name' => 'Pâtes 500g',
                'category' => 'Épicerie',
                'price' => 5.50,
                'quantity' => 120,
                'min_threshold' => 12,
                'description' => 'Pâtes italiennes'
            ],
            [
                'name' => 'Sardines en boîte',
                'category' => 'Conserves',
                'price' => 8.00,
                'quantity' => 70,
                'min_threshold' => 7,
                'description' => 'Sardines à l\'huile'
            ],
            [
                'name' => 'Thon en boîte',
                'category' => 'Conserves',
                'price' => 12.00,
                'quantity' => 55,
                'min_threshold' => 5,
                'description' => 'Thon nature'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
