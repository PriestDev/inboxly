import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiSearch } from 'react-icons/fi';
import { useThemeStore } from '../../context/themeContext';

const ChatList = ({ conversations, onSelectConversation, currentConversation }) => {
  const { isDark } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-4 ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Inbox
        </h2>
        
        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <FiSearch size={18} className={isDark ? 'text-slate-300' : 'text-slate-600'} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-600'
            }`}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className={`flex-1 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {filteredConversations.length === 0 ? (
          <div className={`p-8 text-center ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-sm">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 rounded-[28px] cursor-pointer transition-all border ${
                  currentConversation?._id === conversation._id
                    ? isDark
                      ? 'border-blue-500/40 bg-blue-600/20 shadow-[0_0_0_1px_rgba(96,165,250,0.2)]'
                      : 'border-blue-500/40 bg-blue-50 shadow-[0_12px_30px_-20px_rgba(59,130,246,0.7)]'
                    : isDark
                    ? 'border-gray-700 bg-gray-800 hover:border-blue-500/40 hover:bg-gray-700'
                    : 'border-gray-200 bg-white hover:border-blue-500/40 hover:bg-blue-50'
                }`}
                tabIndex={0}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-lg ${getConversationColor(conversation._id)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {getAvatarInitials(conversation.title)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {conversation.title}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs truncate ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>

                    <p className={`text-xs mt-1 ${
                      isDark ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {formatDistanceToNow(new Date(conversation.lastActivityAt), {
                        addSuffix: true,
                      })}
                    </p>
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
