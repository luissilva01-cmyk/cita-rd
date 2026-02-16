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
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  activeView,
  onViewChange,
  currentUserId,
  onStoryClick,
  onCreateStory,
  chats,
  storiesRefreshKey = 0
}) => {
  // Detectar si la vista activa es un chat individual
  const isChatView = typeof activeView === 'string' && activeView.startsWith('chat-');
  
  return (
    <div className="grid grid-cols-[320px_1fr] min-h-screen" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)'}}>
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
        />
      </aside>

      {/* Main Content */}
      <main className="flex justify-center items-center p-8 min-w-0">
        <div 
          className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden" 
          style={{ 
            maxWidth: '1024px',
            height: isChatView ? 'min(90vh, 800px)' : '100%',
            maxHeight: isChatView ? '90vh' : 'none'
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;