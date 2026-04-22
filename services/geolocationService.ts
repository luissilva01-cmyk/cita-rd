import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { logger } from '../utils/logger';

export interface GeoCoords {
  latitude: number;
  longitude: number;
}

/** Haversine formula — returns distance in km between two lat/lng points */
export function calculateDistanceKm(a: GeoCoords, b: GeoCoords): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** Request browser geolocation and return coords (or null if denied) */
export function getCurrentPosition(): Promise<GeoCoords | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      logger.profile.warn('Geolocation not supported by browser');
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        logger.profile.warn('Geolocation permission denied or error', { code: err.code });
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
}

/** Save lat/lng to the user's Firestore profile */
export async function saveUserLocation(userId: string, coords: GeoCoords): Promise<void> {
  try {
    await updateDoc(doc(db, 'perfiles', userId), {
      latitude: coords.latitude,
      longitude: coords.longitude,
      locationUpdatedAt: Date.now()
    });
    logger.profile.success('User location saved', { userId, lat: coords.latitude.toFixed(3), lng: coords.longitude.toFixed(3) });
  } catch (error) {
    logger.profile.error('Failed to save user location', { userId, error });
  }
}
