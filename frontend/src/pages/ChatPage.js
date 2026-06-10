import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiMinimize2, FiX, FiUser, FiSettings, FiBarChart2, FiUsers, FiLayers } from 'react-icons/fi';
import { useDemoWorkspaceStore } from '../context/demoWorkspaceStore';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';
import ChatList from '../components/ChatList/ChatList';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';
import ChatInsightsPanel from '../components/Chat/ChatInsightsPanel';
import { mockVisitors, mockSupportAgent, mockOfflineContact } from '../data/mockData';

const ChatPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    conversations,
    selectedConversationId,
    selectConversation,
    createConversation,
    submitOfflineForm,
    appendEmailNotification,
    widgetSettings,
    emailNotifications,
    markConversationRead,
    markAllConversationsRead,
    updateWidgetSettings,
    resetDemoWorkspace,
  } = useDemoWorkspaceStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();

  const currentConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId) || conversations[0] || null,
    [conversations, selectedConversationId]
  );

  useEffect(() => {
    if (!conversations.length) {
      return;
    }

    if (!selectedConversationId || !conversations.some((conversation) => conversation._id === selectedConversationId)) {
      selectConversation(conversations[0]._id);
    }
  }, [conversations, selectedConversationId, selectConversation]);

  useEffect(() => {
    if (conversations.length > 0) {
      return;
    }

    addNotification({
      type: 'info',
      title: 'Demo mode',
      message: 'Loaded local mock conversations',
    });
  }, [conversations.length, addNotification]);

  const handleCreateConversation = () => {
    const title = window.prompt('Conversation title', 'New customer inquiry');

    if (!title?.trim()) {
      return;
    }

    const conversation = createConversation({
      title: title.trim(),
      participants: [{ userId: 'visitor-demo', role: 'member' }],
      initialMessage: 'Hi, I need help getting started.',
    });

    selectConversation(conversation._id);
    setSidebarOpen(false);
    addNotification({
      type: 'success',
      title: 'Conversation created',
      message: `${conversation.title} is ready to test`,
    });
  };

  const handleOfflineSubmit = (payload) => {
    const result = submitOfflineForm(payload);
    addNotification({
      type: 'success',
      title: 'Offline form submitted',
      message: `${result.record.name || 'Visitor'} was captured locally`,
    });
  };

  const handleQueueTestNotification = () => {
    const notification = appendEmailNotification({
      title: 'Test email notification sent',
      subtitle: 'Queued from the Inboxly dashboard',
    });

    addNotification({
      type: 'info',
      title: 'Notification queued',
      message: notification.title,
    });
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <OfflineIndicator />

      <button
        type="button"
        onClick={() => navigate('/admin')}
        className={`fixed top-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold shadow-lg transition ${
          isDark
            ? 'border-white/10 bg-gray-800 text-white hover:bg-gray-700'
            : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
        }`}
        aria-label="Exit chat view"
        title="Exit chat view"
      >
        <FiMinimize2 size={16} />
        <span className="hidden sm:inline">Exit chat</span>
      </button>

      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div
        className={`
          ${sidebarOpen ? 'w-full md:w-80' : 'w-0'}
          transition-all duration-300 ${isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} overflow-hidden flex flex-col
        `}
      >
        <div className={`${isDark ? 'bg-slate-950 border-b border-gray-800' : 'bg-white border-b border-gray-200'} p-5`}>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-semibold text-blue-400">Inbox</p>
              <h1 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Inboxly
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Your polished mock chat workspace.
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-3">
            <button
              onClick={handleCreateConversation}
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

            <div className={`rounded-3xl border p-4 ${isDark ? 'border-gray-700 bg-gray-900/60' : 'border-gray-200 bg-gray-50'}`}>
              <p className={`mb-3 text-xs uppercase tracking-[0.28em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dashboard shortcuts</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { to: '/admin', label: 'Overview', icon: FiLayers },
                  { to: '/admin/widgets', label: 'Widget setup', icon: FiSettings },
                  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
                  { to: '/admin/team', label: 'Team', icon: FiUsers },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                        isDark
                          ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={15} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <ChatList
          conversations={conversations}
          onCreateConversation={handleCreateConversation}
          onMarkConversationRead={markConversationRead}
          onMarkAllRead={markAllConversationsRead}
          onSelectConversation={(conversation) => {
            selectConversation(conversation._id);
            setSidebarOpen(false);
          }}
          currentConversation={currentConversation}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden xl:flex-row">
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentConversation ? (
            <ChatWindow conversation={currentConversation} />
          ) : (
            <div className={`flex items-center justify-center h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="text-center">
                <div className="mb-4 text-6xl">💬</div>
                <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Select a conversation to start
                </p>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
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
            widgetSettings={widgetSettings}
            notifications={emailNotifications}
            offlineContact={mockOfflineContact}
            onSubmitOfflineForm={handleOfflineSubmit}
            onQueueTestNotification={handleQueueTestNotification}
            onUpdateWidgetSettings={updateWidgetSettings}
            onResetDemo={resetDemoWorkspace}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
