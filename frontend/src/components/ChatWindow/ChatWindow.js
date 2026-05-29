import React, { useEffect, useState, useRef } from 'react';
import { FiSend, FiSmile } from 'react-icons/fi';
import { chatService } from '../../services/api';
import { useChatStore } from '../../context/chatStore';
import { useAuthStore } from '../../context/authStore';
import { useThemeStore } from '../../context/themeContext';
import { useNotificationStore } from '../../context/notificationContext';
import { formatDistanceToNow } from 'date-fns';
import { mockMessages } from '../../data/mockData';

const ChatWindow = ({ conversation, socket }) => {
  const currentUser = useAuthStore((state) => state.user);
  const { messages, setMessages, typingUsers } = useChatStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        try {
          const response = await chatService.getMessages(conversation._id);
          setMessages(response.data);
          chatService.markAsRead(conversation._id);
        } catch (err) {
          const conversationMsgs = mockMessages.filter(
            (m) => m.conversationId === conversation._id
          );
          setMessages(conversationMsgs);
          addNotification({
            type: 'info',
            title: 'Demo Mode',
            message: 'Showing mock messages'
          });
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (conversation) {
      loadMessages();
      socket?.emit('join_conversation', conversation._id);
    }

    return () => {
      if (conversation) {
        socket?.emit('leave_conversation', conversation._id);
      }
    };
  }, [conversation, socket, setMessages, addNotification]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    socket?.emit('user_stopped_typing', { conversationId: conversation._id });
    setIsTyping(false);

    try {
      const response = await chatService.sendMessage(conversation._id, {
        content: messageInput,
        messageType: 'text',
      });
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setMessageInput('');
      addNotification({
        type: 'success',
        title: 'Message sent',
        message: ''
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      addNotification({
        type: 'error',
        title: 'Failed to send message',
        message: error.response?.data?.message || 'Please try again'
      });
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('user_typing', { conversationId: conversation._id });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('user_stopped_typing', { conversationId: conversation._id });
    }, 2000);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-4 ${isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} sticky top-0 z-10`}>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {conversation.title}
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {conversation.participants.length} participants
        </p>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.length === 0 ? (
          <div className={`text-center mt-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <div className="text-4xl mb-2">💬</div>
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const senderId = message.senderId?._id || message.senderId;
            const isMine = currentUser?._id === senderId;
            const senderName = message.senderId?.username || message.senderName || 'You';

            return (
              <div
                key={message._id}
                className={`flex items-end ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    isMine ? 'bg-gradient-to-br from-green-400 to-teal-500' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  } flex-shrink-0`}>
                    {senderName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className={`max-w-[22rem] sm:max-w-xl ${isMine ? 'text-right' : 'text-left'}`}>
                    <div className={`text-xs font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isMine ? 'You' : senderName}
                    </div>
                    <div className={`rounded-2xl p-3 shadow-sm ${
                      isMine
                        ? 'bg-green-500 text-white'
                        : isDark
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    }`}>
                      <p className="break-words text-sm">{message.content}</p>
                      <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDistanceToNow(new Date(message.timestamp || message.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
            <span>
              {typingUsers.length === 1 ? 'Someone is' : 'Users are'} typing...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className={`p-4 ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'} flex gap-3`}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          aria-label="Message input"
          className={`flex-1 px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-600'
          }`}
        />
        <button
          type="button"
          className={`px-4 py-2 rounded-lg transition ${
            isDark
              ? 'hover:bg-gray-700 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          aria-label="Add emoji"
        >
          <FiSmile size={20} />
        </button>
        <button
          type="submit"
          disabled={!messageInput.trim()}
          className={`px-6 py-2 rounded-lg transition font-semibold flex items-center gap-2 ${
            messageInput.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <FiSend size={18} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
