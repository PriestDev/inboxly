import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { chatService } from '../services/api';
import { useChatStore } from '../context/chatStore';
import ChatList from '../components/ChatList/ChatList';
import ChatWindow from '../components/ChatWindow/ChatWindow';

const ChatPage = () => {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { conversations, setConversations, currentConversation, setCurrentConversation } = useChatStore();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatService.getConversations();
      setConversations(response.data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <ChatList 
          conversations={conversations} 
          onSelectConversation={setCurrentConversation}
          currentConversation={currentConversation}
        />
      </div>
      <div className="flex-1">
        {currentConversation ? (
          <ChatWindow 
            conversation={currentConversation}
            socket={socket}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Select a conversation to start</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
