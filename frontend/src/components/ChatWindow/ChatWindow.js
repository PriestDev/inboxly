import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiSend, FiSmile, FiMic, FiPaperclip, FiInfo, FiMoreVertical, FiUserPlus, FiX, FiClock, FiShield, FiArrowLeft } from 'react-icons/fi';
import { useAuthStore } from '../../context/authStore';
import { useThemeStore } from '../../context/themeContext';
import { useNotificationStore } from '../../context/notificationContext';
import { useDemoWorkspaceStore } from '../../context/demoWorkspaceStore';
import { FiCheck, FiCheckCircle } from 'react-icons/fi';

const EMOJI_OPTIONS = ['😀', '😂', '😍', '🔥', '🎉', '👍', '🙏', '🚀', '💡', '💬', '✨', '🙌'];

const formatRecordingTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

const formatCompactTime = (dateValue) => {
  const timestamp = new Date(dateValue).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
};

const isOutgoingSender = (message, currentUserId) => {
  const senderId = message?.senderId?._id || message?.senderId?.id || message?.senderId;
  const normalizedSenderId = senderId?.toString();
  const normalizedCurrentUserId = currentUserId?.toString();

  return normalizedSenderId === 'self' || normalizedSenderId === 'agent-demo' || normalizedCurrentUserId === normalizedSenderId;
};

const getVisitorState = (visitor) => {
  const status = visitor?.status || 'Offline';

  if (status === 'Active' || status === 'Online') {
    return {
      label: 'Online',
      tone: 'bg-emerald-500',
      textClass: 'text-emerald-500',
      sublabel: 'Visitor is active now',
    };
  }

  if (status === 'Waiting') {
    return {
      label: 'Away',
      tone: 'bg-amber-500',
      textClass: 'text-amber-500',
      sublabel: `Last seen ${visitor?.duration || 'a while ago'}`,
    };
  }

  return {
    label: 'Offline',
    tone: 'bg-slate-500',
    textClass: 'text-slate-500',
    sublabel: `Last seen ${visitor?.duration || 'recently'}`,
  };
};

const ChatWindow = ({ conversation, visitor, onBackToConversations, onToggleVisitorPanel, currentUser: currentUserProp }) => {
  const authUser = useAuthStore((state) => state.user);
  const currentUser = currentUserProp || authUser;
  const { messages, sendMessage, receiveMessage, markConversationRead, updateMessageStatus } = useDemoWorkspaceStore();
  const { isDark } = useThemeStore();
  const { addNotification } = useNotificationStore();
  const [messageInput, setMessageInput] = useState('');
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageTextareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const replyTimeoutRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const visitorState = useMemo(() => getVisitorState(visitor), [visitor]);

  const conversationMessages = useMemo(
    () => messages.filter((message) => message.conversationId === conversation._id),
    [messages, conversation._id]
  );

  useEffect(() => {
    markConversationRead(conversation._id);

    return () => {
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(replyTimeoutRef.current);
    };
  }, [conversation._id, markConversationRead]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    const frameId = window.requestAnimationFrame(() => {
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [conversationMessages.length]);

  useEffect(() => {
    if (!isRecording) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
      return undefined;
    }

    setRecordingSeconds(0);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    };
  }, [isRecording]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isRecording) {
      setIsRecording(false);
      setMessageInput((currentValue) => currentValue || `Voice note ${formatRecordingTime(recordingSeconds)}`);
      return;
    }

    const composedContent = [messageInput.trim(), attachedFile ? `Attachment: ${attachedFile.name}` : '']
      .filter(Boolean)
      .join(' · ')
      .trim();

    if (!composedContent) return;

    setIsTyping(false);
    clearTimeout(typingTimeoutRef.current);

    const content = messageInput.trim();
    const senderName = currentUser?.username || 'You';

    sendMessage({
      conversationId: conversation._id,
      content: composedContent,
      senderId: currentUser?._id || 'self',
      senderName,
    });

    setMessageInput('');
    setAttachedFile(null);
    setIsComposerFocused(false);
    addNotification({
      type: 'success',
      title: 'Message sent',
      message: 'Saved to the demo inbox',
    });

    replyTimeoutRef.current = window.setTimeout(() => {
      receiveMessage({
        conversationId: conversation._id,
        content: `Demo reply: we received "${content.slice(0, 40)}${content.length > 40 ? '…' : ''}"`,
      });

      const sentMessage = conversationMessages[conversationMessages.length - 1];
      if (sentMessage?._id) {
        updateMessageStatus(sentMessage._id, { status: 'delivered' });

        window.setTimeout(() => {
          updateMessageStatus(sentMessage._id, { status: 'read' });
        }, 1200);
      }

      addNotification({
        type: 'info',
        title: 'Demo reply received',
        message: 'The conversation updated locally',
      });
    }, 900);
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleTextareaChange = (event) => {
    setMessageInput(event.target.value);
    setIsComposerFocused(true);
    handleTyping();

    const textarea = messageTextareaRef.current;
    if (!textarea || isRecording) {
      return;
    }

    const lineHeight = Number.parseFloat(window.getComputedStyle(textarea).lineHeight) || 20;
    const verticalPadding = 24;
    const maxHeight = (lineHeight * 5) + verticalPadding;

    textarea.style.height = 'auto';
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  const handleEmojiClick = (emoji) => {
    setMessageInput((currentValue) => `${currentValue}${emoji}`);
    setIsComposerFocused(true);
    setIsEmojiPickerOpen(false);
    window.requestAnimationFrame(() => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName !== 'TEXTAREA') {
        document.querySelector('[aria-label="Message input"]')?.focus();
      }
    });
  };

  const handleAttachmentClick = () => {
    setIsComposerFocused(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setAttachedFile(selectedFile);
    setIsComposerFocused(true);
    event.target.value = '';
  };

  const handleStartRecording = () => {
    setIsEmojiPickerOpen(false);
    setAttachedFile(null);
    setIsRecording(true);
    setIsComposerFocused(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (!messageInput.trim()) {
      setMessageInput(`Voice note ${formatRecordingTime(recordingSeconds)}`);
    }
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const isComposerExpanded = isComposerFocused || Boolean(messageInput.trim()) || Boolean(attachedFile) || isRecording;
  const shouldHideMobileComposerActions = Boolean(messageInput.trim()) || isTyping;

  const renderMessageStatus = (message) => {
    if (!message || !message.senderId) {
      return null;
    }

    const isMine = isOutgoingSender(message, currentUser?._id);

    if (!isMine) {
      return null;
    }

    if (message.status === 'read') {
      return <FiCheckCircle size={14} className="text-sky-400" aria-label="Message read" />;
    }

    if (message.status === 'delivered') {
      return <FiCheck size={14} className="text-slate-300" aria-label="Message delivered" />;
    }

    return <FiCheck size={14} className="text-slate-400" aria-label="Message sent" />;
  };

  const handleAddParticipant = () => {
    setIsMenuOpen(false);
    addNotification({
      type: 'info',
      title: 'Add participant',
      message: 'Participant invitation flow can be connected here.',
    });
  };

  const handleViewVisitorInfo = () => {
    setIsMenuOpen(false);
    onToggleVisitorPanel?.();
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 border-b ${isDark ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'} backdrop-blur-xl p-4`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={onBackToConversations}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition md:hidden ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-gray-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              aria-label="Back to conversations"
              title="Back to conversations"
            >
              <FiArrowLeft size={16} />
            </button>
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-slate-50'}`}>
              <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {visitor?.name?.[0]?.toUpperCase() || conversation.title?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className={`truncate text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {visitor?.name || conversation.title}
                </h2>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                  <span className={`h-2 w-2 rounded-full ${visitorState.tone}`} />
                  {visitorState.label}
                </span>
              </div>
              <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {visitorState.sublabel} · {conversation.participants.length} participants
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleAddParticipant}
              className={`hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-gray-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              aria-label="Add participant"
              title="Add participant"
            >
              <FiUserPlus size={16} />
            </button>
            <button
              type="button"
              onClick={handleViewVisitorInfo}
              className={`hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-gray-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              aria-label="View visitor information"
              title="View visitor information"
            >
              <FiInfo size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${isDark ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10' : 'border-gray-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              aria-label="More options"
              title="More options"
            >
              <FiMoreVertical size={16} />
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="relative">
            <div className={`absolute right-0 top-3 z-30 w-64 rounded-3xl border p-2 shadow-2xl ${isDark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between px-3 py-2">
                <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Menu</p>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
                  aria-label="Close menu"
                >
                  <FiX size={14} />
                </button>
              </div>
              <button type="button" onClick={handleViewVisitorInfo} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                <FiInfo size={15} /> View visitor information
              </button>
              <button type="button" onClick={handleAddParticipant} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                <FiUserPlus size={15} /> Add participant
              </button>
              <button type="button" className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                <FiClock size={15} /> Mark as important
              </button>
              <button type="button" className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${isDark ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'}`}>
                <FiShield size={15} /> Archive conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {conversationMessages.length === 0 ? (
          <div className={`text-center mt-8 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            <div className="text-4xl mb-2">💬</div>
            <p>Start the conversation!</p>
          </div>
        ) : (
          conversationMessages.map((message) => {
            const isMine = isOutgoingSender(message, currentUser?._id);
            const senderName = isMine ? 'You' : (message.senderId?.username || message.senderName || 'Support');

            return (
              <div
                key={message._id}
                className={`flex items-end ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    isMine ? 'bg-gradient-to-br from-green-400 to-teal-500' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  } flex-shrink-0`}>
                    {senderName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className={`max-w-[22rem] sm:max-w-xl ${isMine ? 'text-right' : 'text-left'}`}>
                    <div className={`rounded-2xl p-3 shadow-sm ${
                      isMine
                        ? 'bg-green-500 text-white'
                        : isDark
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    }`}>
                      <p className="break-words text-sm">{message.content}</p>
                      <div className={`mt-1 flex items-center gap-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'} ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <span>{formatCompactTime(message.timestamp || message.createdAt)}</span>
                        {renderMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
            <span>
              Typing a demo reply...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {attachedFile && (
          <div className={`mb-3 rounded-2xl border p-3 ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{attachedFile.name}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {Math.max(1, Math.round(attachedFile.size / 1024))} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className={`rounded-lg px-2 py-1 text-xs font-semibold transition ${isDark ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

        {isRecording ? (
          <div className={`mb-3 rounded-2xl border px-4 py-3 ${isDark ? 'border-red-500/20 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recording voice note</p>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{formatRecordingTime(recordingSeconds)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${isDark ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-end gap-1.5 sm:gap-2 flex-nowrap">
          <div className="min-w-0 flex-1">
            <textarea
              ref={messageTextareaRef}
              value={messageInput}
              onChange={handleTextareaChange}
              onFocus={() => setIsComposerFocused(true)}
              onClick={() => setIsComposerFocused(true)}
              rows={1}
              placeholder={isRecording ? 'Recording in progress...' : 'Type a message...'}
              aria-label="Message input"
              disabled={isRecording}
              className={`w-full resize-none rounded-2xl border px-3 py-2.5 text-sm leading-6 transition focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-4 sm:py-3 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-600'} ${isRecording ? 'opacity-70' : ''} min-h-12 sm:min-h-14 box-border`}
            />

          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen((current) => !current)}
              className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              aria-label="Add emoji"
              title="Add emoji"
            >
              <FiSmile size={20} />
            </button>
            <button
              type="button"
              onClick={handleStartRecording}
              className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition ${shouldHideMobileComposerActions ? 'hidden sm:inline-flex' : 'inline-flex'} ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              aria-label="Record voice message"
              title="Record voice message"
            >
              <FiMic size={20} />
            </button>
            <button
              type="button"
              onClick={handleAttachmentClick}
              className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition ${shouldHideMobileComposerActions ? 'hidden sm:inline-flex' : 'inline-flex'} ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              aria-label="Attach file"
              title="Attach file"
            >
              <FiPaperclip size={20} />
            </button>
            <button
              type="submit"
              disabled={!messageInput.trim() && !attachedFile && !isRecording}
              className={`inline-flex h-9 sm:h-10 items-center gap-2 rounded-xl px-3 sm:px-4 font-semibold transition ${messageInput.trim() || attachedFile || isRecording ? 'bg-blue-500 text-white hover:bg-blue-600' : 'cursor-not-allowed bg-gray-300 text-gray-500'}`}
              aria-label="Send message"
            >
              <FiSend size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </form>

      {isEmojiPickerOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/35 p-4 md:items-center">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close emoji picker"
            onClick={() => setIsEmojiPickerOpen(false)}
          />
          <div className={`relative z-10 w-full max-w-sm rounded-[28px] border p-4 shadow-2xl ${isDark ? 'border-white/10 bg-gray-950' : 'border-gray-200 bg-white'}`}>
            <div className="mb-3 flex items-center justify-between">
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Choose emoji</p>
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen(false)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'}`}
                aria-label="Close emoji picker"
              >
                <FiX size={14} />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className={`aspect-square rounded-2xl text-xl transition ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}
                  aria-label={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
