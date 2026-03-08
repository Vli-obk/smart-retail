import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('products');
            setProducts(res.data.data); // Laravel k-i-sifet f-west 'data'
        } catch (err) { console.error("Erreur fetch products"); }
    };

    return (
        <div className="p-8 ml-64 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Package className="text-blue-600" /> Gestion des Produits
                </h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={20} /> Nouveau Produit
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-700">Nom</th>
                            <th className="p-4 font-semibold text-slate-700">Catégorie</th>
                            <th className="p-4 font-semibold text-slate-700">Prix</th>
                            <th className="p-4 font-semibold text-slate-700">Stock</th>
                            <th className="p-4 font-semibold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b hover:bg-slate-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4 text-slate-500">{p.category}</td>
                                <td className="p-4 font-bold">{p.price} DH</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {p.stock} unités
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit size={18}/></button>
                                    <button className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;