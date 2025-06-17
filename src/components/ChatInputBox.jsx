import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatInputBox = ({ onSend }) => {
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (content.trim()) {
      onSend(content);
      setContent("");
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t border-blue-500/20 bg-gray-800/50">
      <input
        type="text"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-3 rounded-lg bg-gray-700/50 text-white border border-blue-500/20 focus:outline-none"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInputBox;
