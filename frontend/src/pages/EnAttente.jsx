import React from 'react';
import { Hourglass } from 'lucide-react';

const EnAttente = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-6 text-center">
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <Hourglass size={64} className="text-blue-600 animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Module IA en cours de développement</h1>
      <p className="text-slate-500 max-w-md">
        Les prédictions intelligentes basées sur vos stocks et ventes seront bientôt disponibles ici.
      </p>
    </div>
  );
};

export default EnAttente;