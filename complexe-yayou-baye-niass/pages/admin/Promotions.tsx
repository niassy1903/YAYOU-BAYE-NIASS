import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { Promotion, Product } from '../../types';

const Promotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPromo, setNewPromo] = useState({
        productId: '',
        discount: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const [promoRes, prodRes] = await Promise.all([
                api.get('/promotions'),
                api.get('/products')
            ]);
            setPromotions(promoRes.data.map((p: any) => ({...p, id: p._id})));
            setProducts(prodRes.data.map((p: any) => ({...p, id: p._id})));
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRemovePromo = async (id: string) => {
        if (window.confirm('Voulez-vous supprimer cette promotion ?')) {
            try {
                await api.delete(`/promotions/${id}`);
                setPromotions(promotions.filter(p => p._id !== id && p.id !== id));
            } catch (error) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/promotions', newPromo);
            fetchData();
            setIsModalOpen(false);
            setNewPromo({ ...newPromo, productId: '' });
        } catch (error) {
            alert('Erreur lors de la création');
        }
    };

    // Helper to get product details (since population depends on backend implementation)
    // The PDF says .populate('productId', 'name price') is used.
    const getProductDetails = (promo: any) => {
        if (typeof promo.productId === 'object') {
            return promo.productId;
        }
        return products.find(p => p._id === promo.productId || p.id === promo.productId) || {};
    };

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Gestion des Promotions</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une promotion
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {promotions.map((promo) => {
                    const product = getProductDetails(promo);
                    const oldPrice = product.price || 0;
                    const newPrice = oldPrice * (1 - promo.discount / 100);

                    return (
                        <div key={promo._id || promo.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 relative">
                            <div className="absolute top-0 right-0 p-2">
                                <button onClick={() => handleRemovePromo(promo._id || promo.id!)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-pink-100 rounded-md p-3">
                                        <Tag className="h-6 w-6 text-pink-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500 truncate">{product.name || 'Produit inconnu'}</dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">{promo.discount}% OFF</div>
                                        </dd>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Prix: <span className="line-through">{oldPrice.toLocaleString()}</span></span>
                                        <span className="font-bold text-indigo-600">{newPrice.toLocaleString()} FCFA</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Fin: {new Date(promo.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

             {/* Add Promo Modal */}
             {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Nouvelle Promotion</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Produit</label>
                                        <select
                                            required
                                            value={newPromo.productId}
                                            onChange={(e) => setNewPromo({...newPromo, productId: e.target.value})}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Sélectionner un produit</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Pourcentage de réduction (%)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="99"
                                            value={newPromo.discount}
                                            onChange={(e) => setNewPromo({...newPromo, discount: parseInt(e.target.value)})}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date début</label>
                                            <input
                                                type="date"
                                                required
                                                value={newPromo.startDate}
                                                onChange={(e) => setNewPromo({...newPromo, startDate: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date fin</label>
                                            <input
                                                type="date"
                                                required
                                                value={newPromo.endDate}
                                                onChange={(e) => setNewPromo({...newPromo, endDate: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm"
                                        >
                                            Créer la promotion
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotions;