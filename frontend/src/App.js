import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { useThemeStore } from './context/themeContext';
import { authService } from './services/api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import SetupPage from './pages/SetupPage';
import WidgetSettingsPage from './pages/WidgetSettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';
import VisitorsPage from './pages/VisitorsPage';
import SettingsPage from './pages/SettingsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import NotificationCenter from './components/NotificationCenter';
import SiteFooter from './components/SiteFooter';
import './styles/index.css';

function App() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const { isDark, setTheme } = useThemeStore();
  const [authLoading, setAuthLoading] = useState(!!token);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme);
  }, [setTheme]);

  useEffect(() => {
    if (!token || user) {
      setAuthLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, [token, user, setUser, logout]);

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <NotificationCenter />
        <Routes>
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/chat/*"
            element={token ? <ChatPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/widgets"
            element={token ? <WidgetSettingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/analytics"
            element={token ? <AnalyticsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/team"
            element={token ? <TeamPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/visitors"
            element={token ? <VisitorsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/settings"
            element={token ? <SettingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/integrations"
            element={token ? <IntegrationsPage /> : <Navigate to="/login" />}
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
            element={token ? <Navigate to="/chat" /> : <LandingPage />}
          />
        </Routes>
        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
