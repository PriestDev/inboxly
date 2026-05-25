import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatList = ({ conversations, onSelectConversation, currentConversation }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                currentConversation?._id === conversation._id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-800 text-sm truncate flex-1">
                  {conversation.title ||
                    conversation.participants
                      .map((p) => p.userId?.username)
                      .join(', ')}
                </h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatDistanceToNow(new Date(conversation.lastActivityAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {conversation.lastMessage && (
                <p className="text-xs text-gray-600 truncate">
                  {conversation.lastMessage.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
