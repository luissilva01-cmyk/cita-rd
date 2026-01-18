
import React from 'react';
import { Heart, MessageCircle, Sparkles, User, Flame, Home } from 'lucide-react';
import { View } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationBadge from '../NotificationBadge';
import { useNotifications } from '../../hooks/useNotifications';
import { useScreenSize } from '../../hooks/useScreenSize';
import DesktopLayout from '../DesktopLayout';
import { StoryGroup } from '../../services/storiesService';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  chats?: any[];
  currentUserId?: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
  storiesRefreshKey?: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  onViewChange, 
  chats = [], 
  currentUserId = '',
  onStoryClick,
  onCreateStory,
  storiesRefreshKey = 0
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
      >
        {children}
      </DesktopLayout>
    );
  }
  
  // Layout móvil/tablet (existente)
  return (
    <div className="flex flex-col min-h-screen w-full max-w-md lg:max-w-6xl mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr p-1.5 rounded-lg" style={{background: 'linear-gradient(to top right, #FF6B6B, #FFD93D)'}}>
            <Flame className="text-white" size={18} />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent" style={{background: 'linear-gradient(to right, #FF6B6B, #FFD93D)', WebkitBackgroundClip: 'text'}}>
            Ta' Pa' Ti
          </h1>
        </div>
        <button 
          onClick={() => onViewChange('ai-coach')}
          className={`p-2 rounded-full transition-all ${activeView === 'ai-coach' ? 'text-white' : 'text-slate-400 hover:bg-slate-50'}`}
          style={activeView === 'ai-coach' ? {background: 'linear-gradient(to right, #FF6B6B, #FFD93D)'} : {}}
        >
          <Sparkles size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="flex-shrink-0 bg-white border-t border-slate-100 px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center z-10">
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
          notificationCount={notifications.totalMessages}
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
    className={`relative flex flex-col items-center gap-1 transition-all min-w-0 flex-1 ${active ? 'text-slate-600 hover:text-slate-600' : 'text-slate-400 hover:text-slate-600'}`}
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