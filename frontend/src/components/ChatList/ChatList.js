import React, { useMemo, useRef, useState } from 'react';
import { FiCheck, FiMessageSquare, FiMoreVertical, FiPlus, FiSearch, FiX, FiEye, FiMessageCircle, FiVolume2 } from 'react-icons/fi';
import { useThemeStore } from '../../context/themeContext';

const formatCompactRelativeTime = (dateValue) => {
  const timestamp = new Date(dateValue).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
};

const ChatList = ({ conversations, onSelectConversation, currentConversation, onCreateConversation, onMarkConversationRead, onMarkAllRead }) => {
  const { isDark } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');
  const [menuConversation, setMenuConversation] = useState(null);
  const [isMobileLongPress, setIsMobileLongPress] = useState(false);
  const longPressTimerRef = useRef(null);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return conversations.filter((conv) => {
      const matchesSearch = conv.title?.toLowerCase().includes(term) || conv.lastMessage?.content?.toLowerCase().includes(term);
      const matchesFilter = filterMode === 'all'
        || (filterMode === 'unread' && conv.unreadCount > 0)
        || (filterMode === 'active' && Number(conv.unreadCount || 0) === 0);

      return matchesSearch && matchesFilter;
    });
  }, [conversations, filterMode, searchTerm]);

  const unreadCount = conversations.filter((conv) => conv.unreadCount > 0).length;

  const getAvatarInitials = (title) => {
    return title
      ?.split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || '?';
  };

  const getConversationColor = (id) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-green-400 to-green-600',
    ];
    return colors[id?.charCodeAt(0) % colors.length];
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const openConversationMenu = (conversation) => {
    setMenuConversation(conversation);
    setIsMobileLongPress(false);
  };

  const closeConversationMenu = () => {
    setMenuConversation(null);
    setIsMobileLongPress(false);
  };

  const handleConversationOption = (option) => {
    if (!menuConversation) {
      return;
    }

    if (option === 'mark-read' && onMarkConversationRead) {
      onMarkConversationRead(menuConversation._id);
    }

    if (option === 'view-details') {
      const details = `${menuConversation.title} · ${menuConversation.type || 'thread'} · ${menuConversation.unreadCount || 0} unread`;
      window.alert(details);
    }

    if (option === 'mute') {
      window.alert(`Muted ${menuConversation.title} for demo purposes.`);
    }

    closeConversationMenu();
  };

  const startLongPress = (conversation) => {
    clearLongPressTimer();
    setIsMobileLongPress(false);

    longPressTimerRef.current = window.setTimeout(() => {
      setIsMobileLongPress(true);
      openConversationMenu(conversation);
    }, 3000);
  };

  const handleCardPointerDown = (conversation, event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    if (event.pointerType === 'mouse') {
      return;
    }

    startLongPress(conversation);
  };

  const handleCardPointerUp = () => {
    clearLongPressTimer();
  };

  const handleCardClick = (conversation) => {
    if (isMobileLongPress) {
      return;
    }

    onSelectConversation(conversation);
  };

  const conversationMenuActions = [
    { key: 'view-details', label: 'View details', icon: FiEye },
    { key: 'mark-read', label: 'Mark as read', icon: FiMessageCircle },
    { key: 'mute', label: 'Mute conversation', icon: FiVolume2 },
  ];

  return (
    <div className={`flex h-full min-h-0 flex-col ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`border-b ${isDark ? 'border-gray-700 bg-slate-950/80' : 'border-gray-200 bg-white'} p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-500 font-semibold">Conversations</p>
            <h2 className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Inbox
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {conversations.length} threads, {unreadCount} unread
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateConversation}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            <FiPlus size={15} />
            New
          </button>
        </div>

        <div className={`mt-4 flex items-center gap-2 rounded-2xl px-3 py-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <FiSearch size={18} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
          <input
            type="text"
            placeholder="Search by name or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'}`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'active', label: 'Active' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilterMode(item.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filterMode === item.key
                  ? 'bg-sky-500 text-white'
                  : isDark
                  ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={onMarkAllRead}
            className={`ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiCheck size={14} />
            Mark all read
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className={`flex-1 min-h-0 overflow-y-auto pb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {filteredConversations.length === 0 ? (
          <div className={`p-8 text-center ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
              <FiMessageSquare size={20} />
            </div>
            <p className="text-sm font-medium">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="mt-1 text-xs leading-5 opacity-80">
              Try a different filter or create a new thread.
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-2 pb-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => handleCardClick(conversation)}
                onPointerDown={(event) => handleCardPointerDown(conversation, event)}
                onPointerUp={handleCardPointerUp}
                onPointerCancel={handleCardPointerUp}
                onPointerLeave={handleCardPointerUp}
                role="button"
                tabIndex={0}
                className={`group relative p-3 rounded-[24px] cursor-pointer transition-all border ${
                  currentConversation?._id === conversation._id
                    ? isDark
                      ? 'border-blue-500/40 bg-blue-600/20 shadow-[0_0_0_1px_rgba(96,165,250,0.2)]'
                      : 'border-blue-500/40 bg-blue-50 shadow-[0_12px_30px_-20px_rgba(59,130,246,0.7)]'
                    : isDark
                    ? 'border-gray-700 bg-gray-800 hover:border-blue-500/40 hover:bg-gray-700'
                    : 'border-gray-200 bg-white hover:border-blue-500/40 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-2xl ${getConversationColor(conversation._id)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-sky-500/15`}>
                    {getAvatarInitials(conversation.title)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {conversation.title}
                        </h3>
                        <p className={`mt-1 text-xs uppercase tracking-[0.18em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {conversation.type || 'thread'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openConversationMenu(conversation);
                        }}
                        className={`hidden md:inline-flex h-8 w-8 items-center justify-center rounded-full border transition opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto ${isDark ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}
                        aria-label="Conversation options"
                        title="Conversation options"
                      >
                        <FiMoreVertical size={15} />
                      </button>
                    </div>

                    <p className={`mt-1.5 truncate text-xs leading-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                        {formatCompactRelativeTime(conversation.lastActivityAt)}
                      </p>

                      {conversation.unreadCount > 0 && onMarkConversationRead ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onMarkConversationRead(conversation._id);
                          }}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                            isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <FiCheck size={12} />
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {menuConversation && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close conversation options"
            onClick={closeConversationMenu}
          />

          <div className={`relative z-10 w-full max-w-sm rounded-[28px] border p-3 shadow-2xl ${isDark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-white'}`}>
            <div className="mb-2 flex items-start justify-between gap-3 px-2 py-1">
              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Conversation options</p>
                <h4 className={`mt-2 truncate text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {menuConversation.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={closeConversationMenu}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
                aria-label="Close conversation options"
              >
                <FiX size={15} />
              </button>
            </div>

            <div className="space-y-1">
              {conversationMenuActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => handleConversationOption(action.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <Icon size={16} />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
