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
  return (
    <div className="flex min-h-screen" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)'}}>
      {/* Sidebar */}
      <aside className="w-80">
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
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DesktopLayout;