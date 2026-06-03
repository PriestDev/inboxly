import React from 'react';
import { FiArrowLeft, FiUsers, FiMessageSquare, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../context/themeContext';
import { mockAdminStats, mockVisitors, mockWidgetSettings, mockEmailNotifications, mockOfflineContact, mockSupportAgent } from '../data/mockData';
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}> 
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Visitor activity</h2>
            {mockVisitors.slice(0, 3).map((visitor) => (
              <div
                key={visitor.id}
                className={`${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} mb-4 rounded-2xl p-4 border transition hover:shadow-lg hover:border-blue-300`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{visitor.name}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{visitor.company}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${visitor.status === 'Active' ? 'bg-green-500/15 text-green-300' : visitor.status === 'Waiting' ? 'bg-yellow-500/15 text-yellow-300' : 'bg-gray-500/15 text-gray-300'}`}>
                    {visitor.status}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{visitor.location} · {visitor.device}</p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><strong>Page:</strong> {visitor.page}</p>
              </div>
            ))}
          </div>

          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}> 
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Single agent support</h2>
            <div className="flex items-start gap-4">
              <img src={mockSupportAgent.avatar} alt="Agent avatar" className="w-16 h-16 rounded-xl shadow-sm" />
              <div>
                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{mockSupportAgent.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{mockSupportAgent.title}</p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><strong>Status:</strong> {mockSupportAgent.status}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><strong>Response:</strong> {mockSupportAgent.responseTime}</p>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}> 
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Offline contact form</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{mockOfflineContact.description}</p>
            <div className="space-y-3">
              {mockOfflineContact.fields.map((field) => (
                <div key={field} className={`rounded-2xl p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{field}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 inline-flex items-center justify-center rounded-3xl bg-blue-500 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-600 transition">
              {mockOfflineContact.submitLabel}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Widget customization preview</h2>
            <div className={`${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} rounded-3xl overflow-hidden border shadow-sm`}>
              <div className="p-5" style={{ background: mockWidgetSettings.primaryColor, color: '#fff' }}>
                <h3 className="text-lg font-semibold">{mockWidgetSettings.title}</h3>
                <p className="text-sm opacity-90 mt-2">{mockWidgetSettings.welcomeMessage}</p>
              </div>
              <div className={`p-5 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><strong>Position:</strong> {mockWidgetSettings.position}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex items-center gap-2 text-sm"><span className="h-4 w-4 rounded-full" style={{ background: mockWidgetSettings.primaryColor }}></span> Primary</span>
                  <span className="flex items-center gap-2 text-sm"><span className="h-4 w-4 rounded-full" style={{ background: mockWidgetSettings.secondaryColor }}></span> Secondary</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6`}>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>Email notifications</h2>
            <div className="space-y-4">
              {mockEmailNotifications.map((note) => (
                <div key={note.id} className={`rounded-2xl p-4 ${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{note.title}</p>
                    <span className={`text-xs font-semibold ${note.status === 'Delivered' ? 'text-green-400' : note.status === 'Queued' ? 'text-yellow-400' : 'text-blue-400'}`}>{note.status}</span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{note.subtitle}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>{note.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
