import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuthStore } from '../context/authStore';
import { useChatStore } from '../context/chatStore';

const SOCKET_URL = process.env.REACT_APP_SOCKET_IO_URL || 'http://localhost:4000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const token = useAuthStore((state) => state.token);
  const { addMessage, addTypingUser, removeTypingUser } = useChatStore();

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
      addMessage(message);
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
  }, [token, addMessage, addTypingUser, removeTypingUser]);

  return socketRef.current;
};
