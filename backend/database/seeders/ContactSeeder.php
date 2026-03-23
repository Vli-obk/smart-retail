<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'Marie Dupont',
                'email' => 'marie.dupont@example.com',
                'subject' => '3 commande en attente',
                'message' => 'Bonjour, j\'ai actuellement 3 commandes en attente et je souhaiterais savoir quand elles seront traitées. Merci de votre aide.',
                'status' => 'new',
                'created_at' => now()->subHours(2),
            ],
            [
                'name' => 'Jean Martin',
                'email' => 'jean.martin@example.com',
                'subject' => 'Problème de connexion',
                'message' => 'Je n\'arrive pas à me connecter à mon compte depuis hier. J\'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l\'email.',
                'status' => 'in_progress',
                'created_at' => now()->subHours(5),
            ],
            [
                'name' => 'Sophie Bernard',
                'email' => 'sophie.bernard@example.com',
                'subject' => 'Question sur les produits',
                'message' => 'Est-ce que vous allez avoir de nouveaux produits dans la catégorie épicerie bientôt? Je cherche des produits bio spécifiques.',
                'status' => 'resolved',
                'created_at' => now()->subDays(1),
            ],
            [
                'name' => 'Pierre Leroy',
                'email' => 'pierre.leroy@example.com',
                'subject' => 'Retour produit',
                'message' => 'J\'ai reçu un produit endommagé dans ma commande #123. Comment puis-je procéder pour un remboursement ou un échange?',
                'status' => 'new',
                'created_at' => now()->subMinutes(30),
            ],
            [
                'name' => 'Isabelle Moreau',
                'email' => 'isabelle.moreau@example.com',
                'subject' => 'Facturation incorrecte',
                'message' => 'Le montant sur ma facture ne correspond pas aux prix affichés sur le site. Pouvez-vous vérifier et corriger svp?',
                'status' => 'new',
                'created_at' => now()->subHours(1),
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create([
                'name' => $contact['name'],
                'email' => $contact['email'],
                'subject' => $contact['subject'],
                'message' => $contact['message'],
                'status' => $contact['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
