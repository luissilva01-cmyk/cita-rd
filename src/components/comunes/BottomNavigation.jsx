import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Search, 
  Heart, 
  MessageCircle, 
  User 
} from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'home',
      path: '/home',
      icon: Flame,
      label: 'Inicio',
      color: 'text-orange-500'
    },
    {
      id: 'buscar',
      path: '/buscar',
      icon: Search,
      label: 'Buscar',
      color: 'text-blue-500'
    },
    {
      id: 'matches',
      path: '/matches',
      icon: Heart,
      label: 'Matches',
      color: 'text-pink-500'
    },
    {
      id: 'chats',
      path: '/chats',
      icon: MessageCircle,
      label: 'Chats',
      color: 'text-green-500'
    },
    {
      id: 'perfil',
      path: '/perfil',
      icon: User,
      label: 'Perfil',
      color: 'text-purple-500'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-0 relative"
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Icon */}
              <div className={`p-1 ${active ? tab.color : 'text-gray-400'} transition-colors duration-200`}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium mt-1 ${
                active ? 'text-gray-900' : 'text-gray-500'
              } transition-colors duration-200`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}