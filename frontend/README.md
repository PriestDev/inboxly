# Inboxly Chat Frontend

React-based real-time chat interface for the e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Features

- Real-time messaging with WebSocket
- User authentication (login/register)
- Conversation management
- Typing indicators
- Message timestamps
- Responsive design
- Support for multiple user types

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   ├── ChatWindow/
│   │   └── ChatList/
│   ├── context/
│   │   ├── authStore.js
│   │   └── chatStore.js
│   ├── hooks/
│   │   └── useSocket.js
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   └── ChatPage.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── index.css
│   ├── App.js
│   └── index.js
└── package.json
```

## Building for Production

```bash
npm run build
```

## Technologies

- React 18
- Socket.IO Client
- Axios
- Zustand (State Management)
- Tailwind CSS
- React Router
