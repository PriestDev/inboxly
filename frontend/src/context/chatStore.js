import create from 'zustand';

export const useChatStore = create((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  typingUsers: [],
  
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  addTypingUser: (userId) => set((state) => ({
    typingUsers: [...new Set([...state.typingUsers, userId])]
  })),
  removeTypingUser: (userId) => set((state) => ({
    typingUsers: state.typingUsers.filter(id => id !== userId)
  })),
}));
