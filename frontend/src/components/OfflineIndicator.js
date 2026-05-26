import React, { useEffect } from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { useOfflineStore } from '../context/offlineContext';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';

const OfflineIndicator = () => {
  const { isOnline } = useOfflineStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isOnline) {
      addNotification({
        type: 'warning',
        title: 'You are offline',
        message: 'Changes will be synced when you are back online'
      });
    } else {
      addNotification({
        type: 'success',
        title: 'Back online',
        message: 'Syncing changes...'
      });
    }
  }, [isOnline, addNotification]);

  if (isOnline) return null;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 ${
      isDark ? 'bg-red-900/20 border-b border-red-500/30' : 'bg-red-50 border-b border-red-200'
    }`}>
      <FiWifiOff className={isDark ? 'text-red-400' : 'text-red-600'} />
      <span className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>
        You are offline - changes will sync when back online
      </span>
    </div>
  );
};

export default OfflineIndicator;
