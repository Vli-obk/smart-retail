import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-blue-700 mb-4">Smart Retail AI</h1>
                <p className="text-gray-600 text-xl">Bienvenue sur votre plateforme intelligente de gestion.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {/* Section pour les clients */}
                <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition text-center">
                    <h2 className="text-2xl font-bold mb-4">Vous êtes un Client ?</h2>
                    <p className="text-gray-500 mb-6">Inscrivez-vous pour envoyer votre demande d'accès.</p>
                    <Link to="/app/clients" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700">
                        S'inscrire
                    </Link>
                </div>

                {/* Section pour l'admin */}
                <div className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition text-center bg-gray-50">
                    <h2 className="text-2xl font-bold mb-4">Espace Administration</h2>
                    <p className="text-gray-500 mb-6">Accédez à votre tableau de bord sécurisé.</p>
                    <Link to="/login" className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800">
                        Connexion Admin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;