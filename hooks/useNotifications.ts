// cita-rd/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { Chat } from '../services/chatService';

interface NotificationCounts {
  totalMessages: number;
  totalMatches: number;
  totalStories: number;
}

export const useNotifications = (chats: Chat[], currentUserId: string) => {
  const [notifications, setNotifications] = useState<NotificationCounts>({
    totalMessages: 0,
    totalMatches: 0,
    totalStories: 0
  });

  useEffect(() => {
    // Calcular notificaciones de mensajes no leídos
    const unreadMessages = chats.reduce((total, chat) => {
      // Simular mensajes no leídos basado en si el último mensaje no es del usuario actual
      const hasUnread = chat.lastMessage && chat.lastMessageSenderId !== currentUserId;
      return total + (hasUnread ? 1 : 0);
    }, 0);

    // Simular nuevos matches (en una app real esto vendría de Firebase)
    const newMatches = Math.floor(Math.random() * 3); // 0-2 nuevos matches

    // Simular nuevas stories (en una app real esto vendría del servicio de stories)
    const newStories = Math.floor(Math.random() * 5); // 0-4 nuevas stories

    setNotifications({
      totalMessages: unreadMessages,
      totalMatches: newMatches,
      totalStories: newStories
    });
  }, [chats, currentUserId]);

  const clearNotifications = (type: keyof NotificationCounts) => {
    setNotifications(prev => ({
      ...prev,
      [type]: 0
    }));
  };

  return {
    notifications,
    clearNotifications
  };
};