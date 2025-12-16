import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = (path: string) => `
    text-sm font-medium transition-colors duration-300 relative group
    ${location.pathname === path ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}
  `;

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-2' 
          : 'bg-white py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-indigo-500/30 shadow-lg">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                YAYOU<span className="text-indigo-600">BAYE</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>
              Accueil
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link to="/products" className={navLinkClass('/products')}>
              Boutique
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link to="/contact" className={navLinkClass('/contact')}>
              Contact
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            
            {isAdmin && (
               <Link to="/admin/dashboard" className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-100">
                 Admin
               </Link>
            )}

            <div className="flex items-center space-x-6 ml-4 border-l pl-6 border-gray-200">
               <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-md border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 focus:outline-none py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                       <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block p-2 transform opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-xs text-gray-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors">
                      <User className="h-4 w-4 mr-2" /> Mon Profil
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1">
                      <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-white bg-gray-900 hover:bg-indigo-600 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-indigo-600/30 transform hover:-translate-y-0.5">
                  Connexion
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative p-2 text-gray-600 mr-2">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartCount}
                  </span>
                )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">Accueil</Link>
            <Link to="/products" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">Boutique</Link>
            <Link to="/contact" className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">Contact</Link>
            {isAdmin && (
               <Link to="/admin/dashboard" className="block px-4 py-3 rounded-xl text-base font-medium text-indigo-700 bg-indigo-50">Admin Dashboard</Link>
            )}
            {!isAuthenticated ? (
               <Link to="/login" className="block w-full text-center mt-4 px-4 py-3 rounded-xl text-base font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-500/30">Se connecter</Link>
            ) : (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50">Déconnexion</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;