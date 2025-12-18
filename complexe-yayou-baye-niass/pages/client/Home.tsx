import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Truck, 
  ShieldCheck, 
  Zap, 
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Flame,
  Crown,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsVisible(true);
    api.get('/products')
      .then(res => {
        const allProducts = res.data.map((p: any) => ({...p, id: p._id}));
        setFeaturedProducts(allProducts.slice(0, 4));
        if (allProducts.length > 4) {
             setNewArrivals(allProducts.slice(-4).reverse());
        } else {
             setNewArrivals(allProducts.slice(0).reverse());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const customStyles = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes shine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-scroll { animation: scroll 20s linear infinite; }
    .animate-shine { animation: shine 3.5s infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    
    .fade-in-up {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .fade-in-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .stagger-1 { transition-delay: 100ms; }
    .stagger-2 { transition-delay: 200ms; }
    .stagger-3 { transition-delay: 300ms; }
    .stagger-4 { transition-delay: 400ms; }

    .premium-glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .image-container-premium::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4) 100%);
      opacity: 0.6;
      transition: opacity 0.5s;
    }
    .group:hover .image-container-premium::after {
      opacity: 0.9;
    }
  `;

  return (
    <div className="bg-white overflow-hidden">
      <style>{customStyles}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center bg-[#fdfdfd]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-20 pb-16 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`space-y-8 ${isVisible ? 'fade-in-up visible' : 'fade-in-up'}`}>
              <div className="inline-flex items-center space-x-2 bg-white border border-gray-100 rounded-full px-5 py-2 shadow-xl shadow-indigo-500/5">
                <Crown className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-xs font-black text-gray-800 tracking-widest uppercase">L'Excellence du Style</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85]">
                YAYOU <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  BAYE NIASS
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed mx-auto lg:mx-0">
                L'élégance n'est pas une option, c'est un héritage. Découvrez la collection qui redéfinit la mode sénégalaise.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                <Link 
                  to="/products" 
                  className="group relative inline-flex justify-center items-center px-10 py-5 font-black text-white bg-gray-900 rounded-2xl transition-all duration-300 hover:bg-indigo-600 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:-translate-y-2 overflow-hidden"
                >
                  <span className="relative z-10">EXPLORER LA BOUTIQUE</span>
                  <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-700"></div>
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex -space-x-3">
                    {[1,2,3].map((i) => (
                      <img key={i} className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-gray-100" src={`https://picsum.photos/100/100?random=${i+50}`} alt="User" />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-gray-900 leading-none">5k+ Clients</p>
                    <div className="flex text-yellow-500 mt-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative hidden lg:block ${isVisible ? 'fade-in-up visible stagger-2' : 'fade-in-up'}`}>
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/20 transform hover:scale-[1.02] transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Fashion" 
                  className="w-full h-[650px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                    <div className="text-white">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">À la une</p>
                        <h3 className="text-3xl font-black leading-none">HAUTE <br/>COUTURE</h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-5 rounded-[2rem] border border-white/20 animate-float">
                        <Sparkles className="text-yellow-400 w-8 h-8" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className="bg-gray-900 py-6 overflow-hidden whitespace-nowrap border-y border-gray-800">
        <div className="inline-flex animate-scroll">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-12">
              <span className="text-white text-sm font-black tracking-[0.2em] uppercase opacity-80">YAYOU BAYE NIASS LUXURY</span>
              <span className="mx-12 text-indigo-500 font-bold">•</span>
              <span className="text-white text-sm font-black tracking-[0.2em] uppercase opacity-80">SÉNÉGAL FASHION WEEK 2026</span>
              <span className="mx-12 text-indigo-500 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- EXPLOSIVE NEW ARRIVALS SECTION (Mise à jour pour clarté image) --- */}
      <section className="py-32 bg-[#020617] text-white relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
            <div className={`max-w-2xl ${isVisible ? 'fade-in-up visible' : 'fade-in-up'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-12 bg-indigo-500"></div>
                <span className="text-indigo-400 font-black tracking-[0.3em] uppercase text-sm">Drop Limité</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
                NOUVEAUTÉS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-pink-400 italic">
                  EXPLOSIVES
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Des images claires, des détails nets. Découvrez notre sélection exclusive de la semaine, photographiée sous son meilleur jour.
              </p>
            </div>
            
            <Link 
              to="/products" 
              className={`group flex items-center space-x-4 bg-white/5 hover:bg-white/10 px-10 py-5 rounded-2xl border border-white/10 transition-all ${isVisible ? 'fade-in-up visible stagger-1' : 'fade-in-up'}`}
            >
              <span className="font-black tracking-widest text-xs">VOIR LE CATALOGUE</span>
              <div className="bg-indigo-500 p-2 rounded-lg group-hover:translate-x-2 transition-transform">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-[4/5] bg-white/5 rounded-[3rem] animate-pulse"></div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {newArrivals.map((product, idx) => (
                    <div 
                      key={product.id} 
                      className={`group relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 hover:-translate-y-4 border border-white/5 bg-gray-900 ${isVisible ? `fade-in-up visible stagger-${idx+1}` : 'fade-in-up'}`}
                    >
                        {/* Image Layer - Optimized for clarity */}
                        <div className="absolute inset-0 image-container-premium overflow-hidden">
                           <img 
                            src={product.image} 
                            className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110" 
                            alt={product.name} 
                            style={{ filter: 'contrast(1.05) saturate(1.05)' }}
                          />
                        </div>
                        
                        {/* Badges Overlay */}
                        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                            <div className="bg-indigo-500/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                <Zap className="w-3 h-3" /> NOUVEAU
                            </div>
                        </div>

                        {/* Interactive UI Overlay */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                            <div className="space-y-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white leading-tight drop-shadow-md">
                                      {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                      <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">{product.category}</p>
                                      <p className="text-xl font-black text-white tracking-tighter">{product.price.toLocaleString()} FCFA</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <button 
                                      onClick={() => addToCart(product)}
                                      className="flex-1 bg-white text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-tighter hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                      <Plus className="w-4 h-4" /> Panier
                                    </button>
                                    <Link 
                                      to={`/products/${product.id}`}
                                      className="p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 hover:bg-white hover:text-gray-900 transition-all"
                                    >
                                      <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Glossy Reflection Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none bg-gradient-to-br from-white/40 via-transparent to-transparent"></div>
                    </div>
                ))}
            </div>
          )}
          
          <div className="mt-28 text-center">
            <div className="inline-flex flex-col items-center">
                <p className="text-indigo-400 font-bold text-xs tracking-[0.3em] uppercase mb-8 opacity-60">Faites défiler pour la collection complète</p>
                <div className="w-[1px] h-24 bg-gradient-to-b from-indigo-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BENTO GRID CATEGORIES --- */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Nos Univers</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">De la tête aux pieds, nous avons tout ce qu'il faut pour construire votre identité visuelle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-8 h-[900px] md:h-[700px]">
          <Link to="/products" className="group relative md:col-span-2 md:row-span-2 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-2">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Habits" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-12 flex flex-col justify-end">
              <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase mb-4 text-xs">Vêtements</span>
              <h3 className="text-white text-4xl font-black mb-4">HABITS & TEXTILES</h3>
              <p className="text-gray-300 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">Qualité supérieure, coupes impeccables pour hommes et femmes.</p>
            </div>
          </Link>

          <Link to="/products" className="group relative md:col-span-1 md:row-span-1 rounded-[3rem] overflow-hidden shadow-xl transition-all duration-700 hover:-translate-y-2">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Chaussures" />
            <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-black">CHAUSSURES</h3>
            </div>
          </Link>

          <Link to="/products" className="group relative md:col-span-1 md:row-span-2 rounded-[3rem] overflow-hidden shadow-xl transition-all duration-700 hover:-translate-y-2">
            <img src="https://images.unsplash.com/photo-1594035910387-fea4779426e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Parfums" />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent p-8 flex flex-col justify-end">
               <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl w-fit mb-4">
                  <Flame className="w-5 h-5 text-orange-500 fill-current" />
               </div>
               <h3 className="text-white text-3xl font-black">ESSENCES</h3>
            </div>
          </Link>

          <Link to="/products" className="group relative md:col-span-1 md:row-span-1 rounded-[3rem] overflow-hidden shadow-xl transition-all duration-700 hover:-translate-y-2">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Accessoires" />
             <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-black text-right">ACCESSOIRES</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* --- PROMO BANNER --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl auto rounded-[4rem] bg-gray-950 overflow-hidden relative group">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-2000"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-16 md:p-32 text-center md:text-left">
              <span className="text-pink-500 font-black tracking-[0.4em] uppercase mb-6 block text-sm">Offre Événementielle</span>
              <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                TABASKI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">2024</span>
              </h2>
              <p className="text-gray-400 text-xl mb-10 max-w-md">Préparez la fête avec panache. -30% sur toute la collection Bazin et Grand Boubou.</p>
              <button className="relative px-12 py-5 bg-white text-gray-950 font-black rounded-2xl overflow-hidden group hover:bg-yellow-400 transition-colors">
                <span className="relative z-10">PROFITER DE L'OFFRE</span>
              </button>
            </div>
            <div className="h-full min-h-[500px] relative overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Promo"
               />
               <div className="absolute top-10 left-10 bg-indigo-600 px-8 py-8 rounded-full shadow-2xl animate-bounce">
                 <p className="text-5xl font-black text-white">-30%</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDING PRODUCTS --- */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <span className="text-indigo-600 font-black uppercase tracking-widest text-sm">Best-Sellers</span>
              </div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Les Incontournables</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-3 bg-white px-8 py-4 rounded-2xl border border-gray-200 text-gray-900 font-black hover:border-indigo-600 hover:text-indigo-600 transition-all">
              VOIR TOUT <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-400">Analyse du marché...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* --- TRUST & SERVICES --- */}
      <section className="py-32 bg-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Truck, title: "LIVRAISON VIP", desc: "Suivi en temps réel et livraison personnalisée dans tout le Sénégal.", color: "indigo" },
              { icon: ShieldCheck, title: "QUALITÉ CERTIFIÉE", desc: "Chaque pièce subit un contrôle de qualité rigoureux avant envoi.", color: "pink" },
              { icon: Zap, title: "SERVICE CLIENT 24/7", desc: "Nos conseillers style sont disponibles à tout moment via WhatsApp.", color: "yellow" }
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-gray-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 w-fit mb-8 group-hover:scale-110 transition-transform">
                   <item.icon className={`w-10 h-10 text-${item.color}-500`} />
                </div>
                <h3 className="font-black text-2xl text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;