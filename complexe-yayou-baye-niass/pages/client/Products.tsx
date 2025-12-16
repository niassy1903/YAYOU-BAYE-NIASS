import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { Product } from '../../types';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/products')
      .then(res => {
        const mapped = res.data.map((p: any) => ({...p, id: p._id}));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = selectedCategory === "Tous" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Nos Produits</h1>
        
        {/* Category Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <span className="text-gray-500 mr-2 flex items-center">
                <Filter className="h-4 w-4 mr-1" /> Filtres:
            </span>
            {CATEGORIES.map(category => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chargement des produits...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
      ) : (
          <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun produit trouvé dans cette catégorie.</p>
          </div>
      )}
    </div>
  );
};

export default Products;