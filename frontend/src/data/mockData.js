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

export const mockVisitors = [
  {
    id: 'visitor1',
    conversationId: '3',
    name: 'Jamie Cole',
    email: 'jamie.cole@mail.com',
    company: 'BrightShop',
    location: 'San Francisco, CA',
    browser: 'Chrome',
    device: 'MacBook Air',
    page: '/product/eco-bottle',
    status: 'Active',
    duration: '3m ago',
    score: '88%',
  },
  {
    id: 'visitor2',
    conversationId: '2',
    name: 'Nina Patel',
    email: 'nina.patel@mail.com',
    company: 'StudioLuxe',
    location: 'London, UK',
    browser: 'Safari',
    device: 'iPhone',
    page: '/support',
    status: 'Waiting',
    duration: '12m ago',
    score: '95%',
  },
  {
    id: 'visitor3',
    conversationId: '1',
    name: 'Alex Wong',
    email: 'alex.wong@mail.com',
    company: 'MarketFlow',
    location: 'Toronto, Canada',
    browser: 'Edge',
    device: 'Windows Laptop',
    page: '/checkout',
    status: 'Offline',
    duration: '1h ago',
    score: '74%',
  }
];

export const mockSupportAgent = {
  _id: 'agent1',
  name: 'Megan Doe',
  title: 'Customer Success Lead',
  email: 'megan@inboxly.com',
  status: 'Online',
  tagline: 'Your single point of contact for every customer request.',
  responseTime: '1 min avg',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Megan',
};

export const mockWidgetSettings = {
  title: 'Live chat support',
  welcomeMessage: '',
  position: 'bottom-right',
  primaryColor: '#0b74f9',
  secondaryColor: '#6d28d9',
  showAvatar: true,
  offlineText: 'We’re offline now — leave a message and we’ll email you back shortly.',
  buttonText: 'Open chat',
};

export const mockEmailNotifications = [
  {
    id: 'email1',
    title: 'New chat message from Jamie',
    subtitle: 'Notification sent to support@inboxly.com',
    status: 'Delivered',
    timestamp: '2 min ago',
  },
  {
    id: 'email2',
    title: 'Offline form inquiry received',
    subtitle: 'Captured email sent to agents',
    status: 'Queued',
    timestamp: '15 min ago',
  },
  {
    id: 'email3',
    title: 'Agent assignment updated',
    subtitle: 'Single support agent engaged',
    status: 'Sent',
    timestamp: '40 min ago',
  }
];

export const mockOfflineContact = {
  headline: 'Offline contact form active',
  description: 'When your team is away, this form captures visitor requests and sends them to email automatically.',
  submitLabel: 'Send message',
  fields: ['Name', 'Email', 'Message'],
};

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
