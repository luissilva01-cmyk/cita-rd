
import React from 'react';
import { Heart, MessageCircle, Sparkles, User, Home } from 'lucide-react';
import { View } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationBadge from '../NotificationBadge';
import { useNotifications } from '../../hooks/useNotifications';
import { useScreenSize } from '../../hooks/useScreenSize';
import DesktopLayout from '../DesktopLayout';
import { StoryGroup } from '../../services/storiesService';
import Logo from '../Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  chats?: any[];
  currentUserId?: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
  storiesRefreshKey?: number;
  totalUnreadMessages?: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onViewChange, 
  chats = [], 
  currentUserId = '',
  onStoryClick,
  onCreateStory,
  storiesRefreshKey = 0,
  totalUnreadMessages = 0
}) => {
  const { t } = useLanguage();
  const { notifications, clearNotifications } = useNotifications(chats, currentUserId);
  const { isDesktop } = useScreenSize();
  
  // Si es desktop, usar el layout desktop
  if (isDesktop) {
    return (
      <DesktopLayout
        activeView={activeView}
        onViewChange={onViewChange}
        currentUserId={currentUserId}
        onStoryClick={onStoryClick}
        onCreateStory={onCreateStory}
        chats={chats}
        storiesRefreshKey={storiesRefreshKey}
        totalUnreadMessages={totalUnreadMessages}
      >
        {children}
      </DesktopLayout>
    );
  }
  
  // Layout móvil/tablet (existente)
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white dark:bg-[#0f0e0e] shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-white/80 dark:bg-[#141312]/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Logo size={24} useImage={true} />
          <div className="flex flex-col">
            <h1 
              className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight"
              style={{
                background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #fdc830 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Ta' Pa' Ti
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 -mt-0.5">cuando alguien sí te elige</p>
          </div>
        </div>
        <button 
          onClick={() => onViewChange('ai-coach')}
          className={`p-2 rounded-full transition-all ${activeView === 'ai-coach' ? 'text-white' : 'text-slate-400 hover:bg-slate-50'}`}
          style={activeView === 'ai-coach' ? {background: 'linear-gradient(to right, #FF6B6B, #FFD93D)'} : {}}
        >
          <Sparkles size={20} />
        </button>
      </header>

      {/* Main Content - CRITICAL: overflow-auto para permitir scroll */}
      <main className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="flex-shrink-0 bg-white dark:bg-[#141312] border-t border-slate-100 dark:border-white/10 px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center z-10">
        <NavItem 
          icon={<Home size={22} />} 
          active={activeView === 'home'} 
          onClick={() => onViewChange('home')} 
          label={t('home') || 'Inicio'}
        />
        <NavItem 
          icon={<Heart size={22} />} 
          active={activeView === 'discovery'} 
          onClick={() => onViewChange('discovery')} 
          label={t('discover') || 'Explorar'}
          notificationCount={notifications.totalStories}
        />
        <NavItem 
          icon={<MessageCircle size={22} />} 
          active={activeView === 'messages'} 
          onClick={() => {
            clearNotifications('totalMessages');
            onViewChange('messages');
          }} 
          label={t('messages') || 'Mensajes'}
          notificationCount={totalUnreadMessages}
        />
        <NavItem 
          icon={<User size={22} />} 
          active={activeView === 'profile'} 
          onClick={() => onViewChange('profile')} 
          label={t('profile') || 'Perfil'}
        />
      </nav>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  active, 
  onClick, 
  label, 
  notificationCount = 0 
}: { 
  icon: React.ReactNode, 
  active: boolean, 
  onClick: () => void, 
  label: string,
  notificationCount?: number
}) => (
  <button 
    onClick={onClick}
    className={`relative flex flex-col items-center gap-1 transition-all min-w-0 flex-1 ${active ? 'text-slate-600 dark:text-white hover:text-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
    style={active ? {color: '#FF6B6B'} : {}}
  >
    <div className="relative">
      {icon}
      {notificationCount > 0 && (
        <div className="absolute -top-2 -right-2">
          <NotificationBadge count={notificationCount} size="sm" />
        </div>
      )}
    </div>
    <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider truncate w-full text-center">{label}</span>
  </button>
);

export default Layout;