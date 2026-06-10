import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { authService } from '../services/api';
import { useAuthStore } from '../context/authStore';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      setToken(response.data.token);
      setUser(response.data.user);
      addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: `Logged in as ${response.data.user.username}`
      });
      navigate('/chat');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      addNotification({
        type: 'error',
        title: 'Login failed',
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-blue-500 to-purple-600'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className={`rounded-lg shadow-2xl p-8 w-full max-w-md animate-slide-in-up ${
        isDark
          ? 'bg-gray-800'
          : 'bg-white'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <span className="text-white font-bold text-xl">💬</span>
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Inboxly Chat
          </h1>
          <p className={`mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Connect in real-time
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            isDark
              ? 'bg-red-900 border border-red-700'
              : 'bg-red-50 border border-red-200'
          }`}>
            <FiAlertCircle className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <p className={isDark ? 'text-red-200' : 'text-red-700'}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className={`block font-semibold mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email Address
            </label>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-300'
            }`}>
              <FiMail className={isDark ? 'text-slate-300' : 'text-slate-500'} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`flex-1 bg-transparent focus:outline-none ${
                  isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className={`block font-semibold mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-300'
            }`}>
              <FiLock className={isDark ? 'text-slate-300' : 'text-slate-500'} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`flex-1 bg-transparent focus:outline-none ${
                  isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className={`text-center mt-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className={`font-semibold transition hover:underline ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            Register here
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className={`mt-8 p-4 rounded-lg border ${
          isDark
            ? 'bg-gray-700 border-gray-600'
            : 'bg-gray-50 border-gray-300'
        }`}>
          <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Demo Credentials
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Email: <span className="font-mono">alice@example.com</span>
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Password: <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
