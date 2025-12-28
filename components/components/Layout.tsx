
import React from 'react';
import { Heart, MessageCircle, Sparkles, User, Flame } from 'lucide-react';
import { View } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md z-10 sticky top-0 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-orange-500 to-rose-600 p-1.5 rounded-lg">
            <Flame className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            CitaRD
          </h1>
        </div>
        <button 
          onClick={() => onViewChange('ai-coach')}
          className={`p-2 rounded-full transition-all ${activeView === 'ai-coach' ? 'bg-orange-100 text-orange-600' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Sparkles size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar" style={{ height: 'calc(100vh - 140px)' }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="flex-shrink-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-10">
        <NavItem 
          icon={<Heart size={24} />} 
          active={activeView === 'discovery'} 
          onClick={() => onViewChange('discovery')} 
          label={t('discover')}
        />
        <NavItem 
          icon={<MessageCircle size={24} />} 
          active={activeView === 'messages'} 
          onClick={() => onViewChange('messages')} 
          label={t('messages')}
        />
        <NavItem 
          icon={<User size={24} />} 
          active={activeView === 'profile'} 
          onClick={() => onViewChange('profile')} 
          label={t('profile')}
        />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </button>
);

export default Layout;