import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { useThemeStore } from './context/themeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotificationCenter from './components/NotificationCenter';
import './styles/index.css';

function App() {
  const token = useAuthStore((state) => state.token);
  const { isDark, setTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme);
  }, [setTheme]);

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <NotificationCenter />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/chat/*"
            element={token ? <ChatPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={token ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={token ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={token ? <Navigate to="/chat" /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
