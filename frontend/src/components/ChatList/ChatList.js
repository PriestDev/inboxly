import React, { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiCheck, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi';
import { useThemeStore } from '../../context/themeContext';

const ChatList = ({ conversations, onSelectConversation, currentConversation, onCreateConversation, onMarkConversationRead, onMarkAllRead }) => {
  const { isDark } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all');

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

  return (
    <div className={`flex h-full flex-col ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
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
      <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
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
          <div className="space-y-2 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                role="button"
                tabIndex={0}
                className={`p-4 rounded-[28px] cursor-pointer transition-all border ${
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
                  <div className={`w-12 h-12 rounded-2xl ${getConversationColor(conversation._id)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-sky-500/15`}>
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

                      {conversation.unreadCount > 0 ? (
                        <span className="flex-shrink-0 rounded-full bg-sky-500 px-2.5 py-1 text-xs font-bold text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : (
                        <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isDark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                          Read
                        </span>
                      )}
                    </div>

                    <p className={`mt-2 truncate text-xs leading-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                        {formatDistanceToNow(new Date(conversation.lastActivityAt), {
                          addSuffix: true,
                        })}
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
    </div>
  );
};

export default ChatList;
