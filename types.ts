
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  images: string[];
  interests: string[];
  job?: string;
  distance?: string;
  isVerified?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  serverTimestamp?: any; // Firebase serverTimestamp
}

export interface Match {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  timestamp: number;
  serverTimestamp?: any; // Firebase serverTimestamp
  unreadCount?: number;
}

export type View = 'discovery' | 'messages' | 'ai-coach' | 'profile' | 'chat';
