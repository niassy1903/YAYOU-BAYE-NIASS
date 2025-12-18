import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, Smartphone, Check, Loader2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Cart = () => {
  const { cart, removeFromCart, addToCart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);

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
            paymentMethod: method
        };
        const res = await api.post('/orders', orderData);
        return res.data;
    } catch (error) {
        console.error("Checkout error", error);
        return null;
    } finally {
        setIsProcessing(false);
    }
  };

  const handlePayment = async (method: string) => {
    const order = await createOrder(method);
    if (!order) return;

    if (method === 'WhatsApp') {
      let message = `*NOUVELLE COMMANDE (${user?.name})*\n\n`;
      cart.forEach(item => {
          message += `- ${item.name} (x${item.quantity}) : ${(item.price * item.quantity).toLocaleString()} FCFA\n`;
      });
      message += `\n*TOTAL : ${cartTotal.toLocaleString()} FCFA*`;
      window.open(`https://wa.me/221704611894?text=${encodeURIComponent(message)}`, '_blank');
      clearCart();
      navigate('/profile');
    } else {
      setShowPaymentModal(method);
    }
  };

  const confirmPayment = () => {
    clearCart();
    setShowPaymentModal(null);
    navigate('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Smartphone className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Panier Vide</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">Votre sélection est vide. Explorez nos collections pour trouver votre prochain coup de coeur.</p>
          <Link to="/products" className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-black tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
            RETOUR À LA BOUTIQUE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50/30 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/products" className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Mon Panier <span className="text-indigo-600">({cart.length})</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-8 group hover:shadow-xl hover:shadow-gray-200/50 transition-all">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border border-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-black text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">{item.category}</p>
                <div className="flex items-center justify-center sm:justify-start gap-6">
                  <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button className="p-2 text-gray-400 hover:text-indigo-600" onClick={() => {/* quantity logic */}}><Minus className="w-4 h-4"/></button>
                    <span className="px-4 font-black text-gray-900">{item.quantity}</span>
                    <button className="p-2 text-indigo-600 hover:scale-110" onClick={() => addToCart(item)}><Plus className="w-4 h-4"/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id!)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Prix Unitaire</p>
                <p className="text-2xl font-black text-indigo-600">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px] text-gray-400 uppercase">FCFA</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 sticky top-32">
            <h2 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-50 pb-4">Résumé</h2>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-gray-500">
                <span className="font-bold">Sous-total</span>
                <span className="font-black text-gray-900">{cartTotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span className="font-bold">Livraison</span>
                <span className="text-green-500 font-black">Gratuit</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-black text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600">{cartTotal.toLocaleString()}</span>
                  <span className="text-xs text-indigo-400 font-bold ml-2">FCFA</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 text-center">Moyens de paiement</p>
              
              {/* WAVE BUTTON */}
              <button 
                onClick={() => handlePayment('Wave')}
                disabled={isProcessing}
                className="w-full group bg-[#1dc4ff] hover:bg-[#00aef0] p-4 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-blue-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                    <img src="https://static.wave.com/brand/wave-logo.png" alt="Wave" className="w-full object-contain" onError={(e) => { e.currentTarget.src = "https://www.wave.com/favicon.ico"}} />
                  </div>
                  <span className="text-white font-black text-sm tracking-widest uppercase">Payer avec Wave</span>
                </div>
                <div className="bg-white/20 p-2 rounded-lg"><Check className="w-4 h-4 text-white" /></div>
              </button>

              {/* ORANGE MONEY BUTTON */}
              <button 
                onClick={() => handlePayment('Orange Money')}
                disabled={isProcessing}
                className="w-full group bg-[#ff7900] hover:bg-[#e66c00] p-4 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-orange-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-sm group-hover:scale-110 transition-transform">
                    <img src="https://oran.ge/3S5E9oP" alt="OM" className="w-full object-contain" onError={(e) => { e.currentTarget.src = "https://www.orange.sn/favicon.ico"}} />
                  </div>
                  <span className="text-white font-black text-sm tracking-widest uppercase">Orange Money</span>
                </div>
                <div className="bg-white/20 p-2 rounded-lg"><Check className="w-4 h-4 text-white" /></div>
              </button>

              {/* WHATSAPP BUTTON */}
              <button 
                onClick={() => handlePayment('WhatsApp')}
                disabled={isProcessing}
                className="w-full group bg-[#25D366] hover:bg-[#128C7E] p-4 rounded-2xl flex items-center justify-between transition-all shadow-lg shadow-green-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-full h-full text-[#25D366] fill-current" />
                  </div>
                  <span className="text-white font-black text-sm tracking-widest uppercase">Via WhatsApp</span>
                </div>
                <div className="bg-white/20 p-2 rounded-lg"><MessageCircle className="w-4 h-4 text-white" /></div>
              </button>

              {!isAuthenticated && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                   <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">Connexion requise pour commander</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT INSTRUCTION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md" onClick={() => setShowPaymentModal(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className={`h-24 flex items-center justify-center ${showPaymentModal === 'Wave' ? 'bg-[#1dc4ff]' : 'bg-[#ff7900]'}`}>
               <h3 className="text-white font-black text-2xl tracking-tighter uppercase">Finalisation {showPaymentModal}</h3>
            </div>
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              </div>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Veuillez effectuer le transfert de <span className="font-black text-gray-900">{cartTotal.toLocaleString()} FCFA</span> vers le numéro suivant :
              </p>
              <div className="bg-gray-100 p-6 rounded-3xl mb-10 border border-gray-200 group relative">
                 <p className="text-3xl font-black text-indigo-600 tracking-widest select-all">{PAYMENT_NUMBER}</p>
                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full text-[9px] font-black text-gray-400 uppercase border border-gray-100">Numéro Marchand</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <button onClick={confirmPayment} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
                  J'AI EFFECTUÉ LE PAIEMENT
                </button>
                <button onClick={() => setShowPaymentModal(null)} className="text-gray-400 font-bold hover:text-gray-900 py-2">
                  ANNULER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;