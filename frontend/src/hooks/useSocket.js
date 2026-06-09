import { useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '../context/authStore';
import { useChatStore } from '../context/chatStore';
import { chatService } from '../services/api';

const SOCKET_URL = process.env.REACT_APP_SOCKET_IO_URL || 'http://localhost:4000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const currentConversationIdRef = useRef(null);
  const token = useAuthStore((state) => state.token);
  const currentConversation = useChatStore((state) => state.currentConversation);
  const { addMessage, addTypingUser, removeTypingUser, setConversations } = useChatStore();

  useEffect(() => {
    currentConversationIdRef.current = currentConversation?._id ? currentConversation._id.toString() : null;
  }, [currentConversation]);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await chatService.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to refresh conversations:', error);
    }
  }, [setConversations]);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current.emit('authenticate', token);
    });

    socketRef.current.on('new_message', (message) => {
      const incomingConversationId = message?.conversationId ? message.conversationId.toString() : null;
      if (incomingConversationId && incomingConversationId === currentConversationIdRef.current) {
        addMessage(message);
      }

      refreshConversations();
    });

    socketRef.current.on('user_typing', (data) => {
      addTypingUser(data.userId);
    });

    socketRef.current.on('user_stopped_typing', (data) => {
      removeTypingUser(data.userId);
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, addMessage, addTypingUser, removeTypingUser, refreshConversations]);

  return socketRef.current;
};
