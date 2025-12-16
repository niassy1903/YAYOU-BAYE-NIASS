import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, Smartphone, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Cart = () => {
  const { cart, removeFromCart, addToCart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const PAYMENT_NUMBER = "70 461 18 94";

  const createOrder = async (method: string) => {
    if (!isAuthenticated) {
        navigate('/login?redirect=cart');
        return null;
    }
    
    setIsProcessing(true);
    try {
        const orderData = {
            items: cart.map(item => ({
                productId: item.id || item._id,
                quantity: item.quantity,
                price: item.price
            })),
            total: cartTotal,
            paymentMethod: method // Assuming backend accepts this or just notes
        };

        const res = await api.post('/orders', orderData);
        return res.data;
    } catch (error) {
        console.error("Checkout error", error);
        alert("Erreur lors de la création de la commande. Veuillez réessayer.");
        return null;
    } finally {
        setIsProcessing(false);
    }
  };

  const handleWhatsAppCheckout = async () => {
      const order = await createOrder("WhatsApp");
      if (order) {
          // Construct message
          let message = `*NOUVELLE COMMANDE (${user?.name})*\n\n`;
          cart.forEach(item => {
              message += `- ${item.name} (x${item.quantity}) : ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
          });
          message += `\n*TOTAL : ${cartTotal.toLocaleString()} FCFA*`;
          message += `\n\nMerci de confirmer ma commande.`;

          const url = `https://wa.me/221704611894?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank');
          
          clearCart();
          navigate('/profile');
      }
  };

  const handleWaveCheckout = async () => {
      const order = await createOrder("Wave");
      if (order) {
          alert(`COMMANDE ENREGISTRÉE !\n\nPour finaliser, veuillez envoyer ${cartTotal.toLocaleString()} FCFA par Wave au ${PAYMENT_NUMBER}.`);
          // Note: Direct deep linking to Wave payment without Merchant API is limited. 
          // We provide the number and instruction.
          clearCart();
          navigate('/profile');
      }
  };

  const handleOMCheckout = async () => {
      const order = await createOrder("Orange Money");
      if (order) {
          alert(`COMMANDE ENREGISTRÉE !\n\nPour finaliser, veuillez envoyer ${cartTotal.toLocaleString()} FCFA par Orange Money au ${PAYMENT_NUMBER}.`);
          clearCart();
          navigate('/profile');
      }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-6 flex justify-center">
            <div className="bg-indigo-50 p-6 rounded-full">
                <MessageCircle className="h-12 w-12 text-indigo-600" />
            </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Découvrez nos produits et commencez vos achats.</p>
        <Link to="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {cart.map((item) => (
                    <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 h-24 w-24 border border-gray-200 rounded-xl overflow-hidden mb-4 sm:mb-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-center object-cover"
                            />
                        </div>
                        <div className="ml-0 sm:ml-6 flex-1 flex flex-col">
                            <div className="flex justify-between">
                                <h3 className="text-base font-bold text-gray-900">
                                    <Link to={`/products/${item.id}`}>{item.name}</Link>
                                </h3>
                                <p className="text-base font-extrabold text-indigo-600">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                                    <button 
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                                        disabled // Simplified logic
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 text-sm font-bold text-gray-900">{item.quantity}</span>
                                    <button 
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                        onClick={() => addToCart(item)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id!)}
                                    className="font-medium text-red-500 hover:text-red-700 flex items-center text-sm bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                                </button>
                            </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="lg:col-span-4">
            <div className="bg-white shadow-lg shadow-gray-200/50 border border-gray-100 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>
                <div className="flow-root">
                    <dl className="-my-4 divide-y divide-gray-100">
                        <div className="py-4 flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Sous-total</dt>
                            <dd className="text-sm font-bold text-gray-900">{cartTotal.toLocaleString()} FCFA</dd>
                        </div>
                        <div className="py-4 flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Livraison</dt>
                            <dd className="text-sm font-medium text-green-600">Gratuit</dd>
                        </div>
                        <div className="py-4 flex items-center justify-between border-t-2 border-gray-100 mt-2">
                            <dt className="text-lg font-black text-gray-900">Total</dt>
                            <dd className="text-lg font-black text-indigo-600">{cartTotal.toLocaleString()} FCFA</dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-8 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Moyen de paiement</p>
                    
                    {/* WhatsApp Button */}
                    <button
                        onClick={handleWhatsAppCheckout}
                        disabled={isProcessing}
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] border border-transparent rounded-xl shadow-md shadow-green-500/20 py-3.5 px-4 text-white font-bold flex items-center justify-center transition-all transform active:scale-95"
                    >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Commander sur WhatsApp
                    </button>

                    {/* Wave Button */}
                    <button
                        onClick={handleWaveCheckout}
                        disabled={isProcessing}
                        className="w-full bg-[#1dc4ff] hover:bg-[#00aef0] border border-transparent rounded-xl shadow-md shadow-blue-400/20 py-3.5 px-4 text-white font-bold flex items-center justify-center transition-all transform active:scale-95"
                    >
                        <div className="bg-white rounded-full p-0.5 mr-2">
                             <div className="h-4 w-4 bg-[#1dc4ff] rounded-full"></div>
                        </div>
                        Payer avec Wave
                    </button>

                    {/* Orange Money Button */}
                    <button
                        onClick={handleOMCheckout}
                        disabled={isProcessing}
                        className="w-full bg-[#ff7900] hover:bg-[#e66c00] border border-transparent rounded-xl shadow-md shadow-orange-500/20 py-3.5 px-4 text-white font-bold flex items-center justify-center transition-all transform active:scale-95"
                    >
                         <Smartphone className="h-5 w-5 mr-2" />
                        Payer avec Orange Money
                    </button>

                    {!isAuthenticated && (
                        <p className="mt-4 text-xs text-center text-red-500 bg-red-50 py-2 rounded-lg font-medium">
                            Vous devez être connecté pour commander
                        </p>
                    )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 mb-1">Numéro de paiement</p>
                    <p className="font-mono font-bold text-gray-700 text-lg select-all">{PAYMENT_NUMBER}</p>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <Link to="/products" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center justify-center py-2">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Continuer mes achats
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;