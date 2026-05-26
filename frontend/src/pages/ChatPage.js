import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiSettings } from 'react-icons/fi';
import { useSocket } from '../hooks/useSocket';
import { chatService } from '../services/api';
import { useChatStore } from '../context/chatStore';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';
import ChatList from '../components/ChatList/ChatList';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';
import { mockConversations } from '../data/mockData';

const ChatPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { conversations, setConversations, currentConversation, setCurrentConversation } = useChatStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // Try to load from API, fallback to mock data
      try {
        const response = await chatService.getConversations();
        setConversations(response.data);
      } catch (err) {
        // Use mock data if API fails
        console.log('Using mock data for conversations');
        setConversations(mockConversations);
        addNotification({
          type: 'info',
          title: 'Demo Mode',
          message: 'Showing mock conversations'
        });
      }
    } catch (err) {
      console.error(err);
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4`}></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <OfflineIndicator />
      
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-full md:w-80' : 'w-0'
        } transition-all duration-300 ${isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className={`${isDark ? 'bg-gray-900 border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'} p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              WorkNoon
            </h1>
            <ThemeToggle />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/profile')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <FiUser size={18} />
              <span className="text-sm font-semibold">Profile</span>
            </button>
            <button
              onClick={() => navigate('/admin')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              <FiSettings size={18} />
              <span className="text-sm font-semibold">Admin</span>
            </button>
          </div>
        </div>

        {/* Chat List */}
        <ChatList
          conversations={conversations}
          onSelectConversation={(conv) => {
            setCurrentConversation(conv);
            setSidebarOpen(false);
          }}
          currentConversation={currentConversation}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentConversation ? (
          <ChatWindow conversation={currentConversation} socket={socket} />
        ) : (
          <div className={`flex items-center justify-center h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="text-center">
              <div className="mb-4 text-6xl">💬</div>
              <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Select a conversation to start
              </p>
              <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                Choose from your conversations on the left
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
