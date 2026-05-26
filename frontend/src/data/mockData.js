export const mockConversations = [
  {
    _id: '1',
    title: 'Design Team Discussion',
    participants: [
      { userId: 'user1', role: 'admin' },
      { userId: 'user2', role: 'member' }
    ],
    type: 'group',
    lastMessage: { content: 'The new design looks great!', timestamp: new Date(Date.now() - 3600000) },
    lastActivityAt: new Date(Date.now() - 3600000),
    unreadCount: 2
  },
  {
    _id: '2',
    title: 'Sarah Johnson',
    participants: [
      { userId: 'user1', role: 'member' },
      { userId: 'user3', role: 'member' }
    ],
    type: 'direct',
    lastMessage: { content: 'See you tomorrow!', timestamp: new Date(Date.now() - 7200000) },
    lastActivityAt: new Date(Date.now() - 7200000),
    unreadCount: 0
  },
  {
    _id: '3',
    title: 'Product Support',
    participants: [
      { userId: 'user1', role: 'member' },
      { userId: 'support1', role: 'support' }
    ],
    type: 'support',
    lastMessage: { content: 'Your issue has been resolved.', timestamp: new Date(Date.now() - 86400000) },
    lastActivityAt: new Date(Date.now() - 86400000),
    unreadCount: 1
  },
  {
    _id: '4',
    title: 'Marketing Team',
    participants: [
      { userId: 'user1', role: 'member' },
      { userId: 'user4', role: 'admin' },
      { userId: 'user5', role: 'member' }
    ],
    type: 'group',
    lastMessage: { content: 'Campaign launch scheduled for next week.', timestamp: new Date(Date.now() - 172800000) },
    lastActivityAt: new Date(Date.now() - 172800000),
    unreadCount: 0
  }
];

export const mockMessages = [
  {
    _id: '1',
    conversationId: '1',
    senderId: 'user2',
    content: 'Hey everyone, I reviewed the latest designs',
    messageType: 'text',
    timestamp: new Date(Date.now() - 5400000),
    readBy: [{ userId: 'user1', readAt: new Date(Date.now() - 5300000) }]
  },
  {
    _id: '2',
    conversationId: '1',
    senderId: 'user1',
    content: 'Great! What do you think about the color scheme?',
    messageType: 'text',
    timestamp: new Date(Date.now() - 5100000),
    readBy: [{ userId: 'user2', readAt: new Date(Date.now() - 5000000) }]
  },
  {
    _id: '3',
    conversationId: '1',
    senderId: 'user2',
    content: 'The new design looks great!',
    messageType: 'text',
    timestamp: new Date(Date.now() - 3600000),
    readBy: [{ userId: 'user1', readAt: new Date(Date.now() - 3500000) }]
  },
  {
    _id: '4',
    conversationId: '2',
    senderId: 'user3',
    content: 'Hi! How are you doing?',
    messageType: 'text',
    timestamp: new Date(Date.now() - 9000000),
    readBy: [{ userId: 'user1', readAt: new Date(Date.now() - 8900000) }]
  },
  {
    _id: '5',
    conversationId: '2',
    senderId: 'user1',
    content: 'Doing great! Thanks for asking',
    messageType: 'text',
    timestamp: new Date(Date.now() - 8400000),
    readBy: [{ userId: 'user3', readAt: new Date(Date.now() - 8300000) }]
  },
  {
    _id: '6',
    conversationId: '2',
    senderId: 'user3',
    content: 'See you tomorrow!',
    messageType: 'text',
    timestamp: new Date(Date.now() - 7200000),
    readBy: []
  }
];

export const mockUsers = [
  {
    _id: 'user1',
    email: 'alice@example.com',
    username: 'alicewonder',
    firstName: 'Alice',
    lastName: 'Wonder',
    userType: 'buyer',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
  },
  {
    _id: 'user2',
    email: 'designer@example.com',
    username: 'designpro',
    firstName: 'Design',
    lastName: 'Pro',
    userType: 'designer',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design'
  },
  {
    _id: 'user3',
    email: 'sarah@example.com',
    username: 'sarahsmith',
    firstName: 'Sarah',
    lastName: 'Johnson',
    userType: 'seller',
    status: 'away',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    _id: 'user4',
    email: 'mike@example.com',
    username: 'marketer',
    firstName: 'Mike',
    lastName: 'Smith',
    userType: 'agent',
    status: 'offline',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
  }
];

export const mockAdminStats = {
  totalUsers: 1248,
  activeUsers: 342,
  totalConversations: 5634,
  totalMessages: 89234,
  userGrowth: [
    { date: '2026-01-01', users: 400 },
    { date: '2026-02-01', users: 650 },
    { date: '2026-03-01', users: 900 },
    { date: '2026-04-01', users: 1100 },
    { date: '2026-05-01', users: 1248 }
  ],
  messageStats: {
    daily: 2340,
    weekly: 15820,
    monthly: 89234
  }
};
