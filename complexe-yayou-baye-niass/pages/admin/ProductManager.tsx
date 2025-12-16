import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../constants';
import { Edit, Trash, Plus, X, Upload, Image as ImageIcon, Search } from 'lucide-react';
import { Product } from '../../types';
import api from '../../services/api';

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const initialFormState = {
    name: '',
    category: 'Habits',
    price: 0,
    oldPrice: 0,
    stock: 0,
    description: '',
    image: '',
    isPromo: false
  };
  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
       .then(res => {
           setProducts(res.data.map((p: any) => ({...p, id: p._id})));
           setLoading(false);
       })
       .catch(err => {
           console.error(err);
           setLoading(false);
       });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (product: Product) => {
      setEditingId(product.id || product._id);
      setFormData({
          name: product.name,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice || 0,
          stock: product.stock,
          description: product.description,
          image: product.image,
          isPromo: product.isPromo || false
      });
      setIsModalOpen(true);
  };

  const openAddModal = () => {
      setEditingId(null);
      setFormData(initialFormState);
      setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (!formData.image) {
            alert("Veuillez sélectionner une image");
            return;
        }

        if (editingId) {
            // Update
            await api.put(`/products/${editingId}`, formData);
        } else {
            // Create
            await api.post('/products', formData);
        }

        fetchProducts();
        setIsModalOpen(false);
    } catch (err) {
        alert("Erreur lors de l'enregistrement");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
        <div className="flex gap-4 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />
             </div>
            <button 
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
            </button>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
            <div className="p-12 text-center text-gray-500">Chargement des produits...</div>
        ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border border-gray-200">
                        <img className="h-full w-full object-cover" src={product.image} alt="" />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        {product.isPromo && (
                            <span className="px-2 inline-flex text-[10px] leading-5 font-bold rounded-full bg-red-100 text-red-800 uppercase tracking-wide">
                            Promo
                            </span>
                        )}
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{product.price.toLocaleString()} FCFA</span>
                            {product.isPromo && product.oldPrice && (
                                <span className="text-xs text-gray-400 line-through">{product.oldPrice.toLocaleString()}</span>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`text-sm font-bold ${product.stock < 5 ? 'text-red-600' : 'text-green-600'}`}>
                            {product.stock} en stock
                         </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg mr-2 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(product.id!)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <Trash className="h-4 w-4" />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold text-gray-900">
                    {editingId ? 'Modifier le produit' : 'Nouveau produit'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 bg-gray-100 rounded-full p-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                        <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 transition-colors bg-gray-50">
                            <div className="space-y-1 text-center w-full">
                                {formData.image ? (
                                    <div className="relative group">
                                        <img src={formData.image} alt="Preview" className="mx-auto h-40 w-full object-contain rounded-lg" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({...formData, image: ''})}
                                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                            >
                                                <Trash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto h-12 w-12 text-indigo-100 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                                            <ImageIcon className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                <span>Télécharger une image</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5Mo</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                            >
                                {CATEGORIES.filter(c => c !== "Tous").map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                            />
                        </div>
                    </div>

                    {/* Promotion Toggle */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-2 mb-3">
                             <input
                                id="isPromo"
                                type="checkbox"
                                checked={formData.isPromo}
                                onChange={(e) => setFormData({...formData, isPromo: e.target.checked})}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                             />
                             <label htmlFor="isPromo" className="block text-sm font-bold text-gray-900">
                                Activer la promotion
                             </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Prix de vente (FCFA)</label>
                                <input 
                                    type="number" 
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border font-bold text-gray-900"
                                />
                            </div>
                            <div>
                                <label className={`block text-xs font-medium mb-1 ${formData.isPromo ? 'text-gray-700' : 'text-gray-400'}`}>Ancien Prix (Barré)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    disabled={!formData.isPromo}
                                    value={formData.oldPrice}
                                    onChange={(e) => setFormData({...formData, oldPrice: parseInt(e.target.value)})}
                                    className={`block w-full border rounded-lg shadow-sm p-2.5 sm:text-sm ${
                                        formData.isPromo 
                                        ? 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500' 
                                        : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 border"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-4 py-3 bg-indigo-600 text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5"
                        >
                            {editingId ? 'Sauvegarder les modifications' : 'Créer le produit'}
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

export default ProductManager;