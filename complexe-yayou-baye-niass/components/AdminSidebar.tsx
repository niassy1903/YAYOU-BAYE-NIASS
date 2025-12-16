import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Changed from /login to /
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produits', path: '/admin/products', icon: Package },
    { name: 'Clients', path: '/admin/users', icon: Users },
    { name: 'Commandes', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Promotions', path: '/admin/promotions', icon: Tag },
    { name: 'Paramètres', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-xl font-bold tracking-wider">ADMIN PANEL</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-gray-800 hover:text-red-300"
          >
            <LogOut className="mr-3 flex-shrink-0 h-6 w-6" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;