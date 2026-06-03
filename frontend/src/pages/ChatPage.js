import React, { useCallback, useEffect, useState } from 'react';
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
import ChatInsightsPanel from '../components/Chat/ChatInsightsPanel';
import { mockConversations, mockVisitors, mockSupportAgent, mockWidgetSettings, mockEmailNotifications, mockOfflineContact } from '../data/mockData';

const ChatPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { conversations, setConversations, currentConversation, setCurrentConversation } = useChatStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Try to load from API, fallback to mock data
      try {
        const response = await chatService.getConversations();
        const conversations = response.data;
        setConversations(conversations);
        if (!currentConversation && conversations.length > 0) {
          setCurrentConversation(conversations[0]);
        }
      } catch (err) {
        // Use mock data if API fails
        console.log('Using mock data for conversations');
        setConversations(mockConversations);
        if (!currentConversation && mockConversations.length > 0) {
          setCurrentConversation(mockConversations[0]);
        }
        addNotification({
          type: 'info',
          title: 'Demo Mode',
          message: 'Showing mock conversations'
        });
      }
    } catch (err) {
      console.error(err);
      setConversations(mockConversations);
      if (!currentConversation && mockConversations.length > 0) {
        setCurrentConversation(mockConversations[0]);
      }
    } finally {
      setLoading(false);
    }
  }, [currentConversation, setConversations, setCurrentConversation, addNotification]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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
        <div className={`${isDark ? 'bg-slate-950 border-b border-gray-800' : 'bg-white border-b border-gray-200'} p-5`}> 
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-semibold text-blue-400">Inbox</p>
              <h1 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Inboxly
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Your polished real-time chat workspace.
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-3">
            <button
              className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95"
            >
              New conversation
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center justify-center gap-2 rounded-3xl px-3 py-3 text-sm font-semibold transition ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <FiUser size={16} />
                Profile
              </button>
              <button
                onClick={() => navigate('/admin')}
                className={`flex items-center justify-center gap-2 rounded-3xl px-3 py-3 text-sm font-semibold transition ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <FiSettings size={16} />
                Admin
              </button>
            </div>
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
      <div className="flex-1 flex flex-col overflow-hidden xl:flex-row">
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

        <div className={`hidden xl:flex xl:w-96 flex-col overflow-y-auto ${isDark ? 'bg-gray-950 border-l border-gray-800' : 'bg-white border-l border-gray-200'}`}>
          <ChatInsightsPanel
            visitor={mockVisitors.find((visitor) => visitor.conversationId === currentConversation?._id) || mockVisitors[0]}
            agent={mockSupportAgent}
            widgetSettings={mockWidgetSettings}
            notifications={mockEmailNotifications}
            offlineContact={mockOfflineContact}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
