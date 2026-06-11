import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUser, FiSettings, FiMoreVertical, FiUserPlus, FiHome, FiMessageSquare, FiUsers, FiTool, FiLink, FiLogOut } from 'react-icons/fi';
import { useDemoWorkspaceStore } from '../context/demoWorkspaceStore';
import { useThemeStore } from '../context/themeContext';
import { useNotificationStore } from '../context/notificationContext';
import { useAuthStore } from '../context/authStore';
import ChatList from '../components/ChatList/ChatList';
import ChatWindow from '../components/ChatWindow/ChatWindow';
import ThemeToggle from '../components/ThemeToggle';
import OfflineIndicator from '../components/OfflineIndicator';
import ChatInsightsPanel from '../components/Chat/ChatInsightsPanel';
import { mockVisitors } from '../data/mockData';

const ChatPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [visitorPanelOpen, setVisitorPanelOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const {
    conversations,
    selectedConversationId,
    selectConversation,
    createConversation,
    markConversationRead,
    markAllConversationsRead,
  } = useDemoWorkspaceStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();

  const currentConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId) || conversations[0] || null,
    [conversations, selectedConversationId]
  );

  const currentVisitor = useMemo(
    () => mockVisitors.find((visitor) => visitor.conversationId === currentConversation?._id) || mockVisitors[0],
    [currentConversation?._id]
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

  const closeSidebarMenu = () => setSidebarMenuOpen(false);

  const handleSidebarAction = (action) => {
    closeSidebarMenu();
    action?.();
  };

  const handleSignOut = () => {
    closeSidebarMenu();
    logout();
    navigate('/login');
  };

  const handleSelectConversation = (conversation) => {
    selectConversation(conversation._id);

    if (window.matchMedia('(max-width: 767px)').matches) {
      setSidebarOpen(false);
    }
  };

  const handleToggleVisitorPanel = () => {
    setVisitorPanelOpen((current) => !current);
  };

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <OfflineIndicator />

      <div
        className={`
          ${sidebarOpen ? 'w-full md:w-80' : 'w-0'}
          transition-all duration-300 ${isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'} overflow-hidden flex min-h-0 flex-col
        `}
      >
        <div className={`${isDark ? 'bg-slate-950 border-b border-gray-800' : 'bg-white border-b border-gray-200'} p-5`}>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className={`mt-3 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Inboxly
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setSidebarMenuOpen((current) => !current)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-gray-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                aria-label="Open sidebar actions"
                title="Open sidebar actions"
              >
                <FiMoreVertical size={16} />
              </button>
            </div>
          </div>

          {sidebarMenuOpen && (
            <div className="relative">
              <div className={`absolute right-0 top-0 z-30 w-full rounded-[28px] border p-2 shadow-2xl ${isDark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center justify-between px-3 py-2">
                  <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Navigations</p>
                  <button
                    type="button"
                    onClick={closeSidebarMenu}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
                    aria-label="Close sidebar actions"
                  >
                    <FiX size={14} />
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleSidebarAction(() => navigate('/admin'))}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FiHome size={15} />
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarAction(() => navigate('/chat'))}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FiMessageSquare size={15} />
                    Inbox
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarAction(() => navigate('/admin/visitors'))}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FiUsers size={15} />
                    Visitors
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarAction(() => navigate('/admin/team'))}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FiUsers size={15} />
                    Team
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarAction(() => navigate('/admin/settings'))}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FiTool size={15} />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSidebarAction(() => navigate('/admin/integrations'))}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <FiLink size={15} />
                    Integrations
                  </button>
                  <div className={`my-2 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${isDark ? 'text-rose-300 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}
                  >
                    <FiLogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatList
          conversations={conversations}
          onCreateConversation={handleCreateConversation}
          onMarkConversationRead={markConversationRead}
          onMarkAllRead={markAllConversationsRead}
          onSelectConversation={handleSelectConversation}
          currentConversation={currentConversation}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden xl:flex-row">
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentConversation ? (
            <ChatWindow
              conversation={currentConversation}
              visitor={currentVisitor}
              onToggleVisitorPanel={handleToggleVisitorPanel}
              onBackToConversations={() => setSidebarOpen(true)}
            />
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

        {visitorPanelOpen ? (
          <div className={`hidden xl:flex xl:w-96 flex-col overflow-y-auto ${isDark ? 'bg-gray-950 border-l border-gray-800' : 'bg-white border-l border-gray-200'}`}>
            <ChatInsightsPanel visitor={currentVisitor} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatPage;
