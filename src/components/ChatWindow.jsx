import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const ChatWindow = ({ messages, userId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-gray-800/50 p-4 overflow-y-auto">
      {messages.map(msg => (
        <ChatMessage key={msg._id} message={msg} isOwn={msg.sender._id === userId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
