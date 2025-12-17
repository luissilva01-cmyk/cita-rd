import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    ...options
  };

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );
  }, [defaultOptions]);

  const watchPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    setLoading(true);
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );

    return watchId;
  }, [defaultOptions]);

  const clearWatch = useCallback((watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }, []);

  // Get distance to another location
  const getDistanceTo = useCallback((targetLat, targetLon) => {
    if (!location) return null;
    return calculateDistance(
      location.latitude, 
      location.longitude, 
      targetLat, 
      targetLon
    );
  }, [location, calculateDistance]);

  // Format distance for display
  const formatDistance = useCallback((distance) => {
    if (distance === null || distance === undefined) return 'Distancia desconocida';
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km`;
    } else {
      return `${Math.round(distance)}km`;
    }
  }, []);

  // Reverse geocoding (get address from coordinates)
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      // Using a free geocoding service (you might want to use Google Maps API in production)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
      );
      const data = await response.json();
      
      return {
        city: data.city || data.locality || 'Ciudad desconocida',
        country: data.countryName || 'País desconocido',
        fullAddress: data.localityInfo?.administrative?.[0]?.name || data.city || 'Dirección desconocida'
      };
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return {
        city: 'Ciudad desconocida',
        country: 'País desconocido',
        fullAddress: 'Dirección desconocida'
      };
    }
  }, []);

  // Get current location address
  const getCurrentAddress = useCallback(async () => {
    if (!location) return null;
    return await reverseGeocode(location.latitude, location.longitude);
  }, [location, reverseGeocode]);

  return {
    location,
    error,
    loading,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    getDistanceTo,
    formatDistance,
    calculateDistance,
    reverseGeocode,
    getCurrentAddress,
    isSupported: !!navigator.geolocation
  };
};

// Hook specifically for dating app features
export const useDatingGeolocation = () => {
  const geolocation = useGeolocation();
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'

  useEffect(() => {
    // Check current permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        
        result.addEventListener('change', () => {
          setLocationPermission(result.state);
        });
      });
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      await geolocation.getCurrentPosition();
      setLocationPermission('granted');
      setUserLocation(geolocation.location);
      return true;
    } catch (error) {
      setLocationPermission('denied');
      return false;
    }
  }, [geolocation]);

  // Calculate distances to multiple profiles
  const calculateDistancesToProfiles = useCallback((profiles) => {
    if (!geolocation.location) return profiles;

    return profiles.map(profile => ({
      ...profile,
      distance: profile.latitude && profile.longitude 
        ? geolocation.getDistanceTo(profile.latitude, profile.longitude)
        : null,
      distanceFormatted: profile.latitude && profile.longitude
        ? geolocation.formatDistance(geolocation.getDistanceTo(profile.latitude, profile.longitude))
        : 'Distancia desconocida'
    }));
  }, [geolocation]);

  // Filter profiles by distance
  const filterProfilesByDistance = useCallback((profiles, maxDistance) => {
    return profiles.filter(profile => {
      if (!profile.distance) return true; // Include profiles without location data
      return profile.distance <= maxDistance;
    });
  }, []);

  // Sort profiles by distance
  const sortProfilesByDistance = useCallback((profiles) => {
    return [...profiles].sort((a, b) => {
      if (!a.distance && !b.distance) return 0;
      if (!a.distance) return 1;
      if (!b.distance) return -1;
      return a.distance - b.distance;
    });
  }, []);

  return {
    ...geolocation,
    userLocation,
    locationPermission,
    requestLocationPermission,
    calculateDistancesToProfiles,
    filterProfilesByDistance,
    sortProfilesByDistance
  };
};