import React from 'react';
import { ShoppingCart, Heart, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Bonjour, je suis intéressé par le produit *${product.name}* au prix de *${product.price.toLocaleString()} FCFA*.\nEst-il disponible ?`;
    const url = `https://wa.me/221704611894?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100">
      {/* Image Container - Fixed Aspect Ratio */}
      <div className="aspect-[3/4] w-full overflow-hidden relative bg-gray-100">
        <Link to={`/products/${product.id}`} className="block h-full w-full">
            <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-top group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
        </Link>
        
        {/* Badges */}
        {product.isPromo && (
           <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
             PROMO
           </span>
        )}

        {/* Action Overlay */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex flex-col gap-2 z-20">
            <div className="flex gap-2">
                <button
                onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                }}
                className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                <ShoppingCart className="h-4 w-4" />
                Ajouter
                </button>
                <button className="p-3 bg-white/90 backdrop-blur text-gray-900 rounded-xl shadow-lg hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                </button>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Commander sur WhatsApp
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          <Link to={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-baseline gap-3">
             <span className="text-lg font-extrabold text-gray-900">{product.price.toLocaleString()} FCFA</span>
             {product.isPromo && product.oldPrice && (
                 <span className="text-sm text-gray-400 line-through decoration-gray-400">
                    {product.oldPrice.toLocaleString()}
                 </span>
             )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;