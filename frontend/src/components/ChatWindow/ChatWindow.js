import React, { useEffect, useState, useRef } from 'react';
import { chatService } from '../../services/api';
import { useChatStore } from '../../context/chatStore';
import { formatDistanceToNow } from 'date-fns';

const ChatWindow = ({ conversation, socket }) => {
  const { messages, setMessages, typingUsers } = useChatStore();
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      socket?.emit('join_conversation', conversation._id);
    }

    return () => {
      if (conversation) {
        socket?.emit('leave_conversation', conversation._id);
      }
    };
  }, [conversation, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getMessages(conversation._id);
      setMessages(response.data);
      chatService.markAsRead(conversation._id);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    socket?.emit('user_stopped_typing', { conversationId: conversation._id });
    setIsTyping(false);

    try {
      await chatService.sendMessage(conversation._id, {
        content: messageInput,
        messageType: 'text',
      });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">
          {conversation.title ||
            conversation.participants
              .map((p) => p.userId?.username)
              .join(', ')}
        </h2>
        <p className="text-sm text-gray-500">
          {conversation.participants.length} participants
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="flex items-end space-x-3 animate-fadeIn"
            >
              {message.senderAvatar && (
                <img
                  src={message.senderAvatar}
                  alt={message.senderName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex-1 max-w-xs">
                <div className="text-xs text-gray-500 mb-1">
                  {message.senderName}
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-gray-800 break-words">{message.content}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
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
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
