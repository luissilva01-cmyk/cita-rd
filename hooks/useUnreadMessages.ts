import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { logger } from '../utils/logger';

interface UnreadCount {
  [chatId: string]: number;
}

export const useUnreadMessages = (currentUserId: string | undefined) => {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCount>({});
  const [totalUnread, setTotalUnread] = useState(0);

  // Log directo para debugging
  console.log('🔔 [UNREAD HOOK] Inicializado', { currentUserId, totalUnread });

  useEffect(() => {
    console.log('🔔 [UNREAD HOOK] useEffect ejecutado', { currentUserId });
    
    if (!currentUserId) {
      console.log('⚠️ [UNREAD HOOK] No hay currentUserId, limpiando contadores');
      setUnreadCounts({});
      setTotalUnread(0);
      return;
    }

    console.log('📡 [UNREAD HOOK] Configurando listener de Firestore para userId:', currentUserId);

    console.log('📡 [UNREAD HOOK] Configurando listener de Firestore para userId:', currentUserId);

    // Escuchar cambios en todos los chats del usuario
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUserId)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const counts: UnreadCount = {};
      let total = 0;

      console.log('🔍 [UNREAD HOOK] Snapshot recibido', {
        userId: currentUserId,
        totalChats: snapshot.docs.length,
        timestamp: new Date().toLocaleTimeString()
      });

      // Para cada chat, contar mensajes no leídos
      for (const chatDoc of snapshot.docs) {
        const chatId = chatDoc.id;
        const chatData = chatDoc.data();
        
        // Obtener el contador de no leídos del documento del chat
        const fieldName = `unreadCount_${currentUserId}`;
        const unreadCount = chatData[fieldName] || 0;
        
        console.log('📊 [UNREAD HOOK] Chat analizado', {
          chatId: chatId.substring(0, 8) + '...',
          fieldName,
          unreadCount,
          hasField: fieldName in chatData,
          participants: chatData.participants,
          lastMessage: chatData.lastMessage?.substring(0, 20) + '...',
          allUnreadFields: Object.keys(chatData).filter(k => k.startsWith('unreadCount_'))
        });
        
        if (unreadCount > 0) {
          counts[chatId] = unreadCount;
          total += unreadCount;
        }
      }

      setUnreadCounts(counts);
      setTotalUnread(total);

      console.log('✅ [UNREAD HOOK] Contadores actualizados', {
        totalUnread: total,
        chatsWithUnread: Object.keys(counts).length,
        counts,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    console.log('✅ [UNREAD HOOK] Listener configurado exitosamente');

    return () => {
      console.log('🧹 [UNREAD HOOK] Limpiando listener');
      unsubscribe();
    };
  }, [currentUserId]);

  console.log('🔄 [UNREAD HOOK] Render', { totalUnread, unreadCounts });

  return { unreadCounts, totalUnread };
};
