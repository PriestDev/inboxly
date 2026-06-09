import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiWifiOff } from 'react-icons/fi';
import { useOfflineStore } from '../context/offlineContext';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';

const OfflineIndicator = ({ enableBackOnlineAlert = false }) => {
  const { isOnline } = useOfflineStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const { pathname } = useLocation();
  const wasOnlineRef = useRef(isOnline);
  const isDashboardRoute = pathname.startsWith('/admin');
  const showDashboardAlert = enableBackOnlineAlert && isDashboardRoute;

  useEffect(() => {
    if (showDashboardAlert && wasOnlineRef.current === false && isOnline) {
      addNotification({
        type: 'success',
        title: 'Back online',
        message: 'Syncing changes...'
      });
    }

    wasOnlineRef.current = isOnline;
  }, [showDashboardAlert, isOnline, addNotification]);

  if (isOnline || !showDashboardAlert) return null;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 ${
      isDark ? 'bg-red-900/20 border-b border-red-500/30' : 'bg-red-50 border-b border-red-200'
    }`}>
      <FiWifiOff className={isDark ? 'text-red-300' : 'text-red-600'} />
      <span className={`text-sm font-medium ${isDark ? 'text-red-200' : 'text-red-700'}`}>
        You are offline - changes will sync when back online
      </span>
    </div>
  );
};

export default OfflineIndicator;
