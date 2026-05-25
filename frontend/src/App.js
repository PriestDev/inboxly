import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import './styles/index.css';

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat/*"
          element={token ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={token ? <Navigate to="/chat" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
