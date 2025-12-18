import React, { useState } from 'react';
import axios from 'axios';
import { HashRouter, Routes, Route, Outlet, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UserRole } from './types';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, Heart, Menu } from 'lucide-react';

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

// Composant Newsletter
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://yayou-baye-niass.onrender.com/api/newsletter/subscribe', { email });
      setSubmitted(true);
      setEmail('');
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription à la newsletter.');
      console.error('Erreur lors de l\'inscription à la newsletter:', err);
    }
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-white"
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors text-sm"
      >
        S'abonner
      </button>
      {submitted && (
        <p className="text-green-400 text-xs mt-2">Inscription réussie !</p>
      )}
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </form>
  );
};

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

        {/* Newsletter */}
        <div>
           <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
           <p className="text-gray-400 text-sm mb-4">Recevez nos dernières offres et nouveautés.</p>
           <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2026 Complexe Yayou Baye Niass. Tous droits réservés.</p>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !isAdmin) {
      return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header for Admin */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-gray-900">Admin Panel</span>
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
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
