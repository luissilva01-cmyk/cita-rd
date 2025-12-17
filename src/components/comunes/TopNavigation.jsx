import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  Settings,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      id: 'home',
      path: '/home',
      icon: Home,
      label: 'Inicio',
      color: 'text-pink-500'
    },
    {
      id: 'explore',
      path: '/buscar',
      icon: Search,
      label: 'Explorar',
      color: 'text-blue-500'
    },
    {
      id: 'matches',
      path: '/matches',
      icon: Heart,
      label: 'Matches',
      color: 'text-red-500'
    },
    {
      id: 'chats',
      path: '/chats',
      icon: MessageCircle,
      label: 'Mensajes',
      color: 'text-green-500'
    },
    {
      id: 'settings',
      path: '/preferencias',
      icon: Settings,
      label: 'Ajustes',
      color: 'text-gray-500'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Flame className="text-pink-500" size={32} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              CitaRD
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    active
                      ? `${item.color} bg-gray-50`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span className="text-sm">{item.label}</span>
                  
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-current rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* User Profile */}
          <button 
            onClick={() => navigate('/perfil')}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
          >
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
              alt="Mi perfil"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-200"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Usuario'}</p>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}