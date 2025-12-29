
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
  text?: string;
  type: 'text' | 'emoji' | 'voice' | 'image' | 'video';
  content?: string; // Para emojis, URLs de archivos, etc.
  duration?: number; // Para mensajes de voz en segundos
  timestamp: number;
  serverTimestamp?: any; // Firebase serverTimestamp
  isRead?: boolean;
}

export interface Match {
  id: string;
  user: UserProfile;
  lastMessage?: string;
  timestamp: number;
  serverTimestamp?: any; // Firebase serverTimestamp
  unreadCount?: number;
}

export interface Call {
  id: string;
  chatId: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'ended' | 'missed' | 'declined';
  startTime?: number;
  endTime?: number;
  duration?: number;
}

export type View = 'discovery' | 'messages' | 'ai-coach' | 'profile' | 'chat';
