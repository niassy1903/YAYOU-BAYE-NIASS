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
  Play
} from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';
import ProductCard from '../../components/ProductCard';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    // Fetch products from API
    api.get('/products')
      .then(res => {
        const allProducts = res.data.map((p: any) => ({...p, id: p._id}));
        
        // Featured: First 4 products
        setFeaturedProducts(allProducts.slice(0, 4));
        
        // New Arrivals: Last 4 products (reversed to show newest first), distinct from featured if possible
        // If we have enough products, take from the end. If not, just reverse whatever we have.
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

  // Custom CSS for animations
  const customStyles = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 20s linear infinite;
    }
    .fade-in-up {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .fade-in-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .delay-100 { transition-delay: 100ms; }
    .delay-200 { transition-delay: 200ms; }
    .delay-300 { transition-delay: 300ms; }
    .text-stroke {
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
      color: transparent;
    }
  `;

  return (
    <div className="bg-white overflow-hidden">
      <style>{customStyles}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center bg-[#fdfdfd]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className={`space-y-8 ${isVisible ? 'fade-in-up visible' : 'fade-in-up'}`}>
              <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Nouvelle Collection 2026</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                YAYOU <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  BAYE NIASS
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed">
                L'alliance parfaite entre tradition et modernité. Découvrez une mode qui vous ressemble, conçue pour l'élégance au quotidien.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/products" 
                  className="group relative inline-flex justify-center items-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gray-900 font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-indigo-600 hover:shadow-xl hover:-translate-y-1"
                >
                  Shopper Maintenant
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map((i) => (
                      <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://picsum.photos/100/100?random=${i+20}`} alt="User" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-gray-900">5k+ Clients</p>
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Composition */}
            <div className={`relative hidden lg:block ${isVisible ? 'fade-in-up visible delay-200' : 'fade-in-up'}`}>
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/20 transform rotate-2 hover:rotate-0 transition-all duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Fashion Model" 
                  className="w-full h-[600px] object-cover"
                />
                
                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                      <ShoppingBag className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Vente Flash</p>
                      <p className="text-xs text-gray-500">Jusqu'à -50% aujourd'hui</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INFINITE SCROLL MARQUEE --- */}
      <div className="bg-gray-900 py-4 overflow-hidden whitespace-nowrap border-y border-gray-800">
        <div className="inline-flex animate-scroll">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <Sparkles className="text-yellow-400 w-5 h-5 mr-3" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">LIVRAISON GRATUITE DÈS 2.000 FCFA</span>
              <span className="mx-8 text-gray-600">•</span>
              <ShieldCheck className="text-indigo-400 w-5 h-5 mr-3" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">PAIEMENT SÉCURISÉ</span>
              <span className="mx-8 text-gray-600">•</span>
              <Zap className="text-pink-400 w-5 h-5 mr-3" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">NOUVEAUX ARRIVAGES CHAQUE SEMAINE</span>
              <span className="mx-8 text-gray-600">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- BENTO GRID CATEGORIES --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Explorez par Catégorie</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Trouvez exactement ce que vous cherchez parmi nos collections soigneusement organisées.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[800px] md:h-[600px]">
          {/* Main Category */}
          <Link to="/products" className="group relative md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Habits" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-white text-3xl font-bold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Habits</h3>
              <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">La dernière mode pour toutes les occasions.</p>
            </div>
          </Link>

          {/* Secondary 1 */}
          <Link to="/products" className="group relative md:col-span-1 md:row-span-1 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Chaussures" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors p-6 flex flex-col justify-end">
              <h3 className="text-white text-xl font-bold">Chaussures</h3>
            </div>
          </Link>

          {/* Secondary 2 */}
          <Link to="/products" className="group relative md:col-span-1 md:row-span-2 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1594035910387-fea4779426e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Parfums" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
               <h3 className="text-white text-2xl font-bold">Parfums</h3>
               <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white w-fit">Best Sellers</span>
            </div>
          </Link>

          {/* Secondary 3 */}
          <Link to="/products" className="group relative md:col-span-1 md:row-span-1 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Accessoires" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors p-6 flex flex-col justify-end">
              <h3 className="text-white text-xl font-bold">Accessoires</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* --- PROMO BANNER --- */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#111] overflow-hidden relative">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-12 md:p-24 text-center md:text-left">
              <span className="text-indigo-400 font-bold tracking-widest uppercase mb-4 block">Offre Limitée</span>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Tabaski <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Special Sale</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md">Profitez de réductions exceptionnelles allant jusqu'à -50% sur une sélection d'articles pour la fête.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                 <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">Voir les Offres</button>
                 <button className="flex items-center justify-center px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <Play className="w-4 h-4 mr-2 fill-current" /> Voir la Vidéo
                 </button>
              </div>
            </div>
            <div className="h-full min-h-[400px] relative">
               <img 
                src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                className="absolute inset-0 w-full h-full object-cover md:rounded-l-[3rem]"
                alt="Promo"
               />
               <div className="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-xl transform rotate-3">
                 <p className="text-4xl font-black text-gray-900">-50%</p>
                 <p className="text-sm font-medium text-gray-500 text-center">SUR TOUT</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDING PRODUCTS --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-600 font-bold uppercase tracking-wider text-sm">Tendances</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Les Pépites du Moment</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center text-gray-900 font-semibold hover:text-indigo-600 transition-colors">
              Voir tout <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-20">Chargement des produits...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
             <Link to="/products" className="inline-block border border-gray-300 px-8 py-3 rounded-full font-semibold">Voir tout</Link>
          </div>
        </div>
      </section>

      {/* --- SERVICES / TRUST --- */}
      <section className="py-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Livraison Express", desc: "Dakar et toutes les régions en 24h" },
              { icon: ShieldCheck, title: "Garantie Qualité", desc: "Satisfait ou remboursé sous 7 jours" },
              { icon: Zap, title: "Support Client", desc: "Une équipe à votre écoute 7j/7" }
            ].map((item, i) => (
              <div key={i} className="flex items-start p-6 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors duration-300">
                <div className="bg-white p-3 rounded-xl shadow-sm mr-5">
                   <item.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LATEST ARRIVALS (REPLACED NEWSLETTER) --- */}
      <section className="py-24 bg-[#0f172a] text-white overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-2 block">Fraîchement débarqués</span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Nouveautés de la Semaine</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Soyez les premiers à découvrir nos dernières pièces uniques. Stocks limités.</p>
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500">Chargement des nouveautés...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {newArrivals.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-4 bg-white text-[#0f172a] font-bold rounded-full hover:bg-indigo-50 transition-all transform hover:-translate-y-1 shadow-lg shadow-white/10"
            >
              Voir toute la collection <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;