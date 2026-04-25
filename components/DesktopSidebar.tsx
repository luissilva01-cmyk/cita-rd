import React from 'react';
import { Heart, MessageCircle, User, Search, Users, Flame, Home } from 'lucide-react';
import { View } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import StoriesRing from './StoriesRing';
import { StoryGroup } from '../services/storiesService';
import Logo from './Logo';

interface DesktopSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  currentUserId?: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
  chats?: any[];
  storiesRefreshKey?: number;
  totalUnreadMessages?: number;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeView,
  onViewChange,
  currentUserId = 'demo-user',
  onStoryClick,
  onCreateStory,
  chats = [],
  storiesRefreshKey = 0,
  totalUnreadMessages = 0
}) => {
  const { t } = useLanguage();

  // Contar matches y mensajes reales (no hardcodeados)
  const matchesCount = chats.length;
  // Solo mostrar badge si hay mensajes no leídos
  const messagesCount = totalUnreadMessages;

  return (
    <div className="w-80 bg-white dark:bg-[#1a1a1a] h-full flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          {/* Ta' Pa' Ti Logo */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <Logo size={40} useImage={true} />
          </div>
          <div>
            <h1 
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(to right, #f97316, #eab308)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Ta' Pa' Ti
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">cuando alguien sí te elige</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <NavItem
          icon={<Home className="w-6 h-6" />}
          label="Inicio"
          active={activeView === 'home'}
          onClick={() => onViewChange('home')}
        />
        
        <NavItem
          icon={<Search className="w-6 h-6" />}
          label="Explorar"
          active={activeView === 'discovery'}
          onClick={() => onViewChange('discovery')}
        />
        
        <NavItem
          icon={<Users className="w-6 h-6" />}
          label="Matches"
          active={activeView === 'matches'}
          onClick={() => onViewChange('matches')}
          badge={matchesCount}
        />
        
        <NavItem
          icon={<MessageCircle className="w-6 h-6" />}
          label="Mensajes"
          active={activeView === 'messages'}
          onClick={() => onViewChange('messages')}
          badge={messagesCount}
          badgeColor="red"
        />
        
        <NavItem
          icon={<User className="w-6 h-6" />}
          label="Mi Perfil"
          active={activeView === 'profile'}
          onClick={() => onViewChange('profile')}
        />
      </nav>

      {/* Stories Section */}
      <div className="px-4 py-2 mt-auto">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Stories</h3>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {/* Add Story */}
          <div className="flex-shrink-0 text-center">
            <button
              onClick={onCreateStory}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <svg className="text-white" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span className="text-xs text-gray-600 mt-1 block">Tu historia</span>
          </div>
          
          {/* Stories from StoriesRing */}
          <div className="flex-1">
            <StoriesRing
              key={storiesRefreshKey}
              currentUserId={currentUserId}
              onStoryClick={onStoryClick}
              onCreateStory={onCreateStory}
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
  badgeColor?: 'orange' | 'red';
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  badge,
  badgeColor = 'orange'
}) => {
  const bgColor = badgeColor === 'red' ? 'bg-red-500' : 'bg-orange-500';
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors ${
        active 
          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="font-medium flex-1">{label}</span>
      {badge && badge > 0 && (
        <span className={`${bgColor} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center`}>
          {badge}
        </span>
      )}
    </button>
  );
};

export default DesktopSidebar;