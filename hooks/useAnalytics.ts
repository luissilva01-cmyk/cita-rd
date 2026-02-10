/**
 * useAnalytics Hook - Ta' Pa' Ti
 * Hook personalizado para tracking de eventos
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService, AnalyticsEvent } from '../services/analyticsService';

export function useAnalytics() {
  const location = useLocation();

  // Track page views automáticamente
  useEffect(() => {
    analyticsService.trackPageView(location.pathname);
  }, [location.pathname]);

  // Funciones helper para eventos comunes
  const trackLogin = useCallback((method: string) => {
    analyticsService.trackEvent(AnalyticsEvent.LOGIN, { method });
  }, []);

  const trackRegister = useCallback((method: string) => {
    analyticsService.trackEvent(AnalyticsEvent.REGISTER, { method });
  }, []);

  const trackSwipe = useCallback((direction: 'left' | 'right', profileId: string) => {
    const event = direction === 'left' 
      ? AnalyticsEvent.PROFILE_SWIPE_LEFT 
      : AnalyticsEvent.PROFILE_SWIPE_RIGHT;
    
    analyticsService.trackEvent(event, { profile_id: profileId });
  }, []);

  const trackMatch = useCallback((matchId: string, profileId: string) => {
    analyticsService.trackEvent(AnalyticsEvent.MATCH_CREATED, {
      match_id: matchId,
      profile_id: profileId,
    });
  }, []);

  const trackMessage = useCallback((
    type: 'text' | 'voice' | 'video' | 'photo',
    recipientId: string
  ) => {
    const eventMap = {
      text: AnalyticsEvent.MESSAGE_SENT,
      voice: AnalyticsEvent.VOICE_MESSAGE_SENT,
      video: AnalyticsEvent.VIDEO_MESSAGE_SENT,
      photo: AnalyticsEvent.PHOTO_MESSAGE_SENT,
    };

    analyticsService.trackEvent(eventMap[type], {
      message_type: type,
      recipient_id: recipientId,
    });
  }, []);

  const trackStory = useCallback((action: 'create' | 'view' | 'react', storyId?: string) => {
    const eventMap = {
      create: AnalyticsEvent.STORY_CREATED,
      view: AnalyticsEvent.STORY_VIEWED,
      react: AnalyticsEvent.STORY_REACTION,
    };

    analyticsService.trackEvent(eventMap[action], {
      story_id: storyId,
      action,
    });
  }, []);

  const trackPhotoUpload = useCallback((photoIndex: number, isProfilePhoto: boolean) => {
    analyticsService.trackEvent(AnalyticsEvent.PHOTO_UPLOAD, {
      photo_index: photoIndex,
      is_profile_photo: isProfilePhoto,
    });
  }, []);

  const trackNotification = useCallback((
    action: 'granted' | 'denied' | 'received' | 'clicked'
  ) => {
    const eventMap = {
      granted: AnalyticsEvent.NOTIFICATION_PERMISSION_GRANTED,
      denied: AnalyticsEvent.NOTIFICATION_PERMISSION_DENIED,
      received: AnalyticsEvent.NOTIFICATION_RECEIVED,
      clicked: AnalyticsEvent.NOTIFICATION_CLICKED,
    };

    analyticsService.trackEvent(eventMap[action]);
  }, []);

  return {
    trackLogin,
    trackRegister,
    trackSwipe,
    trackMatch,
    trackMessage,
    trackStory,
    trackPhotoUpload,
    trackNotification,
    trackEvent: analyticsService.trackEvent.bind(analyticsService),
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
  };
}
