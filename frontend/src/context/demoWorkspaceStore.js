import create from 'zustand';
import {
  mockConversations,
  mockMessages,
  mockWidgetSettings,
  mockEmailNotifications,
} from '../data/mockData';

const STORAGE_KEY = 'inboxly-demo-workspace';

const clone = (value) => JSON.parse(JSON.stringify(value));

const makeId = (prefix) => {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${randomPart}`;
};

const buildDefaultState = () => ({
  conversations: clone(mockConversations),
  messages: clone(mockMessages),
  widgetSettings: clone(mockWidgetSettings),
  emailNotifications: clone(mockEmailNotifications),
  offlineSubmissions: [],
  selectedConversationId: mockConversations[0]?._id || null,
});

const readStoredState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to read demo workspace state:', error);
    return null;
  }
};

const persistState = (state) => {
  if (typeof window === 'undefined') {
    return;
  }

  const serializable = {
    conversations: state.conversations,
    messages: state.messages,
    widgetSettings: state.widgetSettings,
    emailNotifications: state.emailNotifications,
    offlineSubmissions: state.offlineSubmissions,
    selectedConversationId: state.selectedConversationId,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
};

const initialStoredState = readStoredState();
const initialState = {
  ...buildDefaultState(),
  ...initialStoredState,
};

export const useDemoWorkspaceStore = create((set) => {
  const commit = (updater) =>
    set((state) => {
      const patch = typeof updater === 'function' ? updater(state) : updater;
      const nextState = { ...state, ...patch };
      persistState(nextState);
      return patch;
    });

  return {
    ...initialState,
    setConversations: (conversations) => commit({ conversations }),
    selectConversation: (selectedConversationId) => commit({ selectedConversationId }),
    createConversation: ({ title, participants = [], initialMessage = 'Hello! Thanks for reaching out.' }) => {
      const timestamp = new Date().toISOString();
      const conversation = {
        _id: makeId('conv'),
        title,
        participants,
        type: 'support',
        lastMessage: {
          content: initialMessage,
          timestamp,
        },
        lastActivityAt: timestamp,
        unreadCount: 0,
      };

      const message = {
        _id: makeId('msg'),
        conversationId: conversation._id,
        senderId: 'visitor-demo',
        senderName: title,
        content: initialMessage,
        messageType: 'text',
        timestamp,
        readBy: [],
      };

      commit((state) => ({
        conversations: [conversation, ...state.conversations],
        messages: [message, ...state.messages],
        selectedConversationId: conversation._id,
      }));

      return conversation;
    },
    sendMessage: ({ conversationId, content, senderId = 'agent-demo', senderName = 'You', messageType = 'text' }) => {
      const timestamp = new Date().toISOString();
      const message = {
        _id: makeId('msg'),
        conversationId,
        senderId: {
          _id: senderId,
          username: senderName,
        },
        senderName,
        content,
        messageType,
        timestamp,
        readBy: [{ userId: senderId, readAt: timestamp }],
      };

      commit((state) => ({
        messages: [...state.messages, message],
        conversations: state.conversations.map((conversation) => (
          conversation._id === conversationId
            ? {
                ...conversation,
                lastMessage: {
                  content,
                  timestamp,
                },
                lastActivityAt: timestamp,
                unreadCount: 0,
              }
            : conversation
        )),
      }));

      return message;
    },
    receiveMessage: ({ conversationId, content, senderId = 'support-demo', senderName = 'Inboxly Assistant', messageType = 'text' }) => {
      const timestamp = new Date().toISOString();
      const message = {
        _id: makeId('msg'),
        conversationId,
        senderId: {
          _id: senderId,
          username: senderName,
        },
        senderName,
        content,
        messageType,
        timestamp,
        readBy: [],
      };

      commit((state) => ({
        messages: [...state.messages, message],
        conversations: state.conversations.map((conversation) => (
          conversation._id === conversationId
            ? {
                ...conversation,
                lastMessage: {
                  content,
                  timestamp,
                },
                lastActivityAt: timestamp,
                unreadCount: conversation.unreadCount + 1,
              }
            : conversation
        )),
      }));

      return message;
    },
    markConversationRead: (conversationId) => commit((state) => ({
      conversations: state.conversations.map((conversation) => (
        conversation._id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation
      )),
    })),
    markAllConversationsRead: () => commit((state) => ({
      conversations: state.conversations.map((conversation) => ({
        ...conversation,
        unreadCount: 0,
      })),
    })),
    updateWidgetSettings: (updates) => commit((state) => ({
      widgetSettings: {
        ...state.widgetSettings,
        ...updates,
      },
    })),
    appendEmailNotification: (notification) => {
      const entry = {
        id: makeId('email'),
        timestamp: 'just now',
        status: 'Queued',
        ...notification,
      };

      commit((state) => ({
        emailNotifications: [entry, ...state.emailNotifications],
      }));

      return entry;
    },
    submitOfflineForm: ({ name, email, message, company }) => {
      const record = {
        id: makeId('lead'),
        name,
        email,
        message,
        company: company || 'Website visitor',
        createdAt: new Date().toISOString(),
        status: 'Queued',
      };

      const notification = {
        title: `Offline message from ${name || 'a visitor'}`,
        subtitle: email || 'No email provided',
        status: 'Queued',
        timestamp: 'just now',
      };

      commit((state) => ({
        offlineSubmissions: [record, ...state.offlineSubmissions],
        emailNotifications: [
          {
            id: makeId('email'),
            ...notification,
          },
          ...state.emailNotifications,
        ],
      }));

      return { record, notification };
    },
    resetDemoWorkspace: () => {
      const resetState = buildDefaultState();
      persistState(resetState);
      set(resetState);
    },
  };
});