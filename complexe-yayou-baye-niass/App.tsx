import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UserRole } from './types';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, Heart } from 'lucide-react';

// Layouts
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/client/Home';
import Products from './pages/client/Products';
import Cart from './pages/client/Cart';
import Contact from './pages/client/Contact';
import Login from './pages/auth/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import Users from './pages/admin/Users';
import Orders from './pages/admin/Orders';
import Promotions from './pages/admin/Promotions';
import Settings from './pages/admin/Settings';

const Footer = () => (
  <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/" className="inline-block">
             <span className="font-black text-3xl tracking-tighter text-white">
                YAYOU<span className="text-indigo-500">BAYE</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            L'excellence du style sénégalais. Nous combinons tradition et modernité pour vous offrir des produits uniques de haute qualité.
          </p>
          <div className="flex space-x-4">
             <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors text-white">
                <Instagram className="w-5 h-5" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white">
                <Facebook className="w-5 h-5" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 transition-colors text-white">
                <Twitter className="w-5 h-5" />
             </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Navigation</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" /> Accueil</Link></li>
            <li><Link to="/products" className="hover:text-indigo-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" /> Boutique</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" /> Mon Panier</Link></li>
            <li><Link to="/profile" className="hover:text-indigo-400 transition-colors flex items-center"><ArrowRight className="w-3 h-3 mr-2" /> Mon Compte</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
           <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
           <ul className="space-y-4 text-sm text-gray-400">
             <li className="flex items-start">
               <MapPin className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" />
               <span>Marché HLM, Boutique N°102<br/>Dakar, Sénégal</span>
             </li>
             <li className="flex items-center">
               <Phone className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" />
               <span>+221 70 461 18 94</span>
             </li>
             <li className="flex items-center">
               <Mail className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0" />
               <span>contact@yayoubayeniass.com</span>
             </li>
           </ul>
        </div>

        {/* Newsletter (Visual only) */}
        <div>
           <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
           <p className="text-gray-400 text-sm mb-4">Recevez nos dernières offres et nouveautés.</p>
           <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
             <input 
              type="email" 
              placeholder="Votre email" 
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-white"
             />
             <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors text-sm">
               S'abonner
             </button>
           </form>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2024 Complexe Yayou Baye Niass. Tous droits réservés.</p>
        <div className="flex items-center space-x-1 mt-4 md:mt-0">
          <span>Fait avec</span>
          <Heart className="w-3 h-3 text-red-500 fill-current" />
          <span>au Sénégal</span>
        </div>
      </div>
    </div>
  </footer>
);

const ClientLayout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-grow pt-14">
      <Outlet />
    </main>
    <Chatbot />
    <Footer />
  </div>
);

const AdminLayout = () => {
  const { user, isAdmin } = useAuth();
  
  if (!user || !isAdmin) {
      return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
             <span className="font-bold">Admin Panel</span>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            {/* Public/Client Routes */}
            <Route element={<ClientLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<div className="p-10 text-center">Détails produit (À venir)</div>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<div className="p-10 text-center text-2xl">Mon Profil</div>} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />

            {/* Admin Routes (Protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;