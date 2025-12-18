import React from 'react';
import { ShoppingCart, Heart, MessageCircle, Zap, ArrowUpRight } from 'lucide-react';
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
    <div className="group relative flex flex-col h-full">
      {/* Main Image Layer */}
      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-lg shadow-gray-200/50 group-hover:shadow-indigo-500/20 transition-all duration-700 border border-gray-100 group-hover:border-indigo-100">
        
        <Link to={`/products/${product.id}`} className="block h-full w-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-110"
            />
        </Link>

        {/* Glossy Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
            {product.isPromo && (
              <div className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                <Zap className="w-3 h-3 fill-current" /> OFFRE SPÉCIALE
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-[0.2em] border border-white/20">
              {product.category}
            </div>
        </div>

        {/* Floating Heart Button */}
        <button className="absolute top-5 right-5 p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 hover:bg-white hover:text-red-500 border border-white/20">
          <Heart className="h-4 w-4" />
        </button>

        {/* Action Bottom Overlay */}
        <div className="absolute inset-x-6 bottom-6 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-75 z-20 space-y-3">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                }}
                className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
            >
                <ShoppingCart className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                Ajouter au Panier
            </button>
            <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366]/90 backdrop-blur-md text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2"
            >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Express
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6 px-2 space-y-2">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                <Link to={`/products/${product.id}`} className="flex items-center gap-1">
                    {product.name}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </h3>
        </div>
        
        <div className="flex items-baseline gap-3">
            <span className="text-xl font-black text-gray-900 tracking-tight">
                {product.price.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold ml-0.5">FCFA</span>
            </span>
            {product.isPromo && product.oldPrice && (
                <span className="text-sm text-gray-300 line-through decoration-gray-300/50 font-medium">
                {product.oldPrice.toLocaleString()}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;