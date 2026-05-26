import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useThemeStore } from '../context/themeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FiSun size={20} className="text-yellow-400" />
      ) : (
        <FiMoon size={20} className="text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
