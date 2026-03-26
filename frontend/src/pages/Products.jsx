import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUpDown,
  Archive,
  AlertCircle
} from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('products');
            const data = res.data.data || res.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) { 
            console.error("Erreur fetch products", err); 
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = Array.isArray(products) ? products.filter(p => 
        (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (p.category?.name?.toLowerCase() || p.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    ) : [];

    return (
        <div className="p-8 animate-fade-in space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventaire des Produits</h1>
                    <p className="text-slate-500 font-medium">Gérez et surveillez l'architecture de votre vitrine numérique.</p>
                </div>
                <button 
                    onClick={() => alert("Fonctionnalité d'importation bientôt disponible !")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus size={20} />
                    Importer un Nouvel Atout
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou catégorie..." 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter size={18} />
                        Filtrer
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <ArrowUpDown size={18} />
                        Trier
                    </button>
                </div>
            </div>

            {/* Products Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">Atout Numérique</th>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">Classification</th>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">Valorisation</th>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">État du Stock</th>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest text-right">Opérations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1,2,3,4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="p-6"><div className="h-8 bg-slate-100 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
                                    <tr key={p.id} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <Archive size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium tracking-tight">ID: #SR-00{p.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {p.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-slate-900">{p.price?.toLocaleString()} <span className="text-[10px] text-slate-400">DH</span></p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${p.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-black uppercase ${p.stock < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    {p.stock} unités
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
                                                    <Edit size={16}/>
                                                </button>
                                                <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all shadow-sm">
                                                    <Trash2 size={16}/>
                                                </button>
                                                <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-xl transition-all shadow-sm">
                                                    <MoreVertical size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                <AlertCircle size={40} />
                                            </div>
                                             <div>
                                                <p className="text-slate-900 font-black text-lg">Aucun produit trouvé</p>
                                                <p className="text-slate-400 font-medium italic">Essayez d'ajuster vos filtres de recherche</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Affichage de {filteredProducts.length} sur {products.length} Résultats</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 disabled:opacity-50">Précédent</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 shadow-sm shadow-blue-500/5">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;