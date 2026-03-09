import React from 'react';
import { View } from '../types';
import DesktopSidebar from './DesktopSidebar';
import { StoryGroup } from '../services/storiesService';

interface DesktopLayoutProps {
  children: React.ReactNode;
  activeView: View;
  onViewChange: (view: View) => void;
  currentUserId?: string;
  onStoryClick?: (storyGroup: StoryGroup) => void;
  onCreateStory?: () => void;
  chats?: any[];
  storiesRefreshKey?: number;
  totalUnreadMessages?: number;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  activeView,
  onViewChange,
  currentUserId,
  onStoryClick,
  onCreateStory,
  chats,
  storiesRefreshKey = 0,
  totalUnreadMessages = 0
}) => {
  // Detectar si la vista activa es un chat individual
  const isChatView = typeof activeView === 'string' && activeView.startsWith('chat-');
  
  return (
    <div 
      className="grid grid-cols-[320px_1fr] min-h-screen" 
      style={{
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.06) 25%, transparent 25%),
          linear-gradient(225deg, rgba(255,255,255,0.06) 25%, transparent 25%),
          linear-gradient(45deg, rgba(255,255,255,0.06) 25%, transparent 25%),
          linear-gradient(315deg, rgba(255,255,255,0.06) 25%, transparent 25%),
          linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)
        `,
        backgroundPosition: '15px 0, 15px 0, 0 0, 0 0, 0 0',
        backgroundSize: '30px 30px, 30px 30px, 30px 30px, 30px 30px, 100% 100%'
      }}
    >
      {/* Sidebar */}
      <aside className="flex-shrink-0">
        <DesktopSidebar
          activeView={activeView}
          onViewChange={onViewChange}
          currentUserId={currentUserId}
          onStoryClick={onStoryClick}
          onCreateStory={onCreateStory}
          chats={chats}
          storiesRefreshKey={storiesRefreshKey}
          totalUnreadMessages={totalUnreadMessages}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full p-4 lg:p-8 xl:p-12">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;