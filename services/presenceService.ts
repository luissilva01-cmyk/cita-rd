// cita-rd/services/presenceService.ts
import { db } from './firebase';
import { doc, setDoc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface PresenceStatus {
  online: boolean;
  lastSeen: number;
  serverTimestamp?: any;
}

/**
 * Set user's online status
 * Call this when user opens the app
 */
export const setUserOnline = async (userId: string): Promise<void> => {
  try {
    const presenceRef = doc(db, 'presence', userId);
    await setDoc(presenceRef, {
      online: true,
      lastSeen: Date.now(),
      serverTimestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error setting user online:', error);
  }
};

/**
 * Set user's offline status
 * Call this when user closes the app or logs out
 */
export const setUserOffline = async (userId: string): Promise<void> => {
  try {
    const presenceRef = doc(db, 'presence', userId);
    await setDoc(presenceRef, {
      online: false,
      lastSeen: Date.now(),
      serverTimestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error setting user offline:', error);
  }
};

/**
 * Listen to user's presence status in real-time
 * Returns unsubscribe function
 */
export const listenToUserPresence = (
  userId: string,
  callback: (status: PresenceStatus) => void
): (() => void) => {
  const presenceRef = doc(db, 'presence', userId);
  
  const unsubscribe = onSnapshot(
    presenceRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Convert Firestore Timestamp to number if needed
        let lastSeen = data.lastSeen;
        if (data.serverTimestamp && data.serverTimestamp instanceof Timestamp) {
          lastSeen = data.serverTimestamp.toMillis();
        }
        
        callback({
          online: data.online || false,
          lastSeen: lastSeen || Date.now()
        });
      } else {
        // User has never been online, default to offline
        callback({
          online: false,
          lastSeen: Date.now()
        });
      }
    },
    (error) => {
      console.error('Error listening to presence:', error);
      callback({
        online: false,
        lastSeen: Date.now()
      });
    }
  );
  
  return unsubscribe;
};

/**
 * Format last seen time for display
 * Returns "En línea" if online, or "Activo hace X" if offline
 */
export const formatPresenceStatus = (
  status: PresenceStatus,
  t: (key: any, params?: any) => string
): string => {
  if (status.online) {
    return t('online');
  }
  
  const now = Date.now();
  const diffInMinutes = Math.floor((now - status.lastSeen) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return t('activeJustNow'); // "Activo justo ahora"
  } else if (diffInMinutes < 60) {
    return t('activeMinutesAgo', { minutes: diffInMinutes.toString() }); // "Activo hace X min"
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return t('activeHoursAgo', { hours: hours.toString() }); // "Activo hace X h"
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return t('activeDaysAgo', { days: days.toString() }); // "Activo hace X d"
  }
};

/**
 * Setup presence system for current user
 * Automatically sets online on mount and offline on unmount
 * Also handles page visibility changes
 */
export const setupPresenceSystem = (userId: string): (() => void) => {
  // Set user online immediately
  setUserOnline(userId);
  
  // Handle page visibility changes
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setUserOffline(userId);
    } else {
      setUserOnline(userId);
    }
  };
  
  // Handle beforeunload (user closes tab/window)
  const handleBeforeUnload = () => {
    setUserOffline(userId);
  };
  
  // Add event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Return cleanup function
  return () => {
    setUserOffline(userId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
