import React from "react";

const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-xs px-4 py-2 rounded-lg ${isOwn ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
