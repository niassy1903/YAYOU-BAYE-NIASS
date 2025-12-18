import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Sparkles, ArrowUp, Loader2, LayoutGrid, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import { Product } from '../../types';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const loaderTrigger = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 8;

  // Initial Fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        const mapped = res.data.map((p: any) => ({...p, id: p._id}));
        setProducts(mapped);
        setPage(1);
        setHasMore(mapped.length > ITEMS_PER_PAGE);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let filtered = products;
    if (selectedCategory !== "Tous") filtered = filtered.filter(p => p.category === selectedCategory);
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setDisplayProducts(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [selectedCategory, searchTerm, products]);

  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    
    setTimeout(() => {
      const filtered = products.filter(p => {
        const catMatch = selectedCategory === "Tous" || p.category === selectedCategory;
        const searchMatch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return catMatch && searchMatch;
      });

      const nextItems = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
      if (nextItems.length > 0) {
        setDisplayProducts(prev => [...prev, ...nextItems]);
        setPage(prev => prev + 1);
        setHasMore(filtered.length > (page + 1) * ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
      setIsFetchingMore(false);
    }, 800);
  }, [page, hasMore, isFetchingMore, products, selectedCategory, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    }, { threshold: 0.1 });
    if (loaderTrigger.current) observer.observe(loaderTrigger.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card { animation: fadeInUp 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* --- PREMIUM HEADER --- */}
      <div className="bg-white border-b border-gray-100 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] tracking-[0.3em] uppercase mb-4">
                <Sparkles className="w-4 h-4" /> Collection Exclusive
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-6">
                TOUT VOTRE <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 italic">UNIVERS STYLE</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                Filtrez par catégorie, recherchez vos modèles préférés et laissez-vous porter par notre sélection premium.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Rechercher une pépite..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl w-full md:w-80 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION & FILTERS --- */}
      <div className="sticky top-[56px] z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-20 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-500/10 scale-105' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
          <button className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-all flex-shrink-0">
             <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-[3rem]"></div>
                <div className="h-6 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-10">
              {displayProducts.map((p, idx) => (
                <div key={`${p.id}-${idx}`} className="animate-card" style={{ animationDelay: `${(idx % 8) * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <div ref={loaderTrigger} className="mt-32 py-10 flex flex-col items-center">
              {isFetchingMore ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse"></div>
                  </div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Chargement...</span>
                </div>
              ) : hasMore ? (
                <div className="w-[1px] h-24 bg-gradient-to-b from-indigo-500 to-transparent"></div>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-100 p-6 rounded-full inline-block mb-6">
                    <LayoutGrid className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Toute la collection a été chargée</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-40 text-center">
             <div className="text-8xl mb-8">🔍</div>
             <h3 className="text-3xl font-black text-gray-900 mb-4">Aucun résultat trouvé</h3>
             <p className="text-gray-500 mb-10">Essayez de modifier vos filtres ou votre recherche.</p>
             <button onClick={() => {setSelectedCategory("Tous"); setSearchTerm("");}} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
               TOUT RÉINITIALISER
             </button>
          </div>
        )}
      </div>

      {showScrollTop && (
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="fixed bottom-10 right-10 z-50 bg-white text-gray-900 p-5 rounded-2xl shadow-2xl border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-2">
           <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Products;