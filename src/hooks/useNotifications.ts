"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, useShowNotifications } from '@/apis/apiCalls';
import type { Notification } from '@/types/notification-types';

/**
 * Custom hook to manage notifications state
 * Provides real-time notification count and methods to interact with notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { data: notificationsData, isLoading, refetch } = useShowNotifications();

  // Update local state when API data changes
  useEffect(() => {
    if (notificationsData?.records && Array.isArray(notificationsData.records)) {
      setNotifications(notificationsData.records);
      const unread = notificationsData.records.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    }
  }, [notificationsData]);

  // Force refresh notifications
  const refreshNotifications = useCallback(() => {
    refetch();
  }, [refetch]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.is_read);
  }, [notifications]);

  // Get recent notifications (last 5)
  const getRecentNotifications = useCallback(() => {
    return notifications.slice(0, 5);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    getUnreadNotifications,
    getRecentNotifications,
  };
}; 