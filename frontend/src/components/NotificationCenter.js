import React from 'react';
import { FiX } from 'react-icons/fi';
import { useNotificationStore } from '../context/notificationContext';
import { useThemeStore } from '../context/themeContext';

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const { isDark } = useThemeStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } ${
            notification.type === 'success'
              ? isDark ? 'border-green-500/30' : 'border-green-200'
              : notification.type === 'error'
              ? isDark ? 'border-red-500/30' : 'border-red-200'
              : isDark ? 'border-blue-500/30' : 'border-blue-200'
          }`}
        >
          <div className="flex-1">
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {notification.title}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <FiX size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
