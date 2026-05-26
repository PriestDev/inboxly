import React, { useState } from 'react';
import { FiArrowLeft, FiUsers, FiMessageSquare, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../context/themeContext';
import { mockAdminStats } from '../data/mockData';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const StatCard = ({ icon: Icon, label, value, change }) => (
    <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={24} className="text-blue-500" />
        <span className="text-sm font-semibold text-green-500">{change}%</span>
      </div>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{label}</p>
      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value.toLocaleString()}</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <OfflineIndicator />

      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chat')}
              className={`p-2 rounded-lg hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition`}
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={mockAdminStats.totalUsers}
            change={12}
          />
          <StatCard
            icon={FiActivity}
            label="Active Users"
            value={mockAdminStats.activeUsers}
            change={8}
          />
          <StatCard
            icon={FiMessageSquare}
            label="Total Conversations"
            value={mockAdminStats.totalConversations}
            change={15}
          />
          <StatCard
            icon={FiTrendingUp}
            label="Total Messages"
            value={mockAdminStats.totalMessages}
            change={22}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              User Growth
            </h2>
            <div className="space-y-3">
              {mockAdminStats.userGrowth.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`w-20 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {point.date}
                  </span>
                  <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{ width: `${(point.users / mockAdminStats.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-sm">{point.users}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Stats */}
          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Message Statistics
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Daily</span>
                  <span className="font-semibold">{mockAdminStats.messageStats.daily}</span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="w-1/3 h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Weekly</span>
                  <span className="font-semibold">{mockAdminStats.messageStats.weekly}</span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="w-2/3 h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Monthly</span>
                  <span className="font-semibold">{mockAdminStats.messageStats.monthly}</span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
