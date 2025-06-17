import React from "react";

const ChatSidebar = ({ contacts, onSelect, activeContact }) => {
  return (
    <div className="w-72 bg-gray-800/50 border-r border-blue-500/20 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">Contacts</h2>
      {contacts.map(contact => (
        <div
          key={contact._id}
          onClick={() => onSelect(contact)}
          className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer hover:bg-blue-500/20 transition ${
            activeContact && activeContact._id === contact._id ? "bg-blue-500/20" : ""
          }`}
        >
          <img
            src={contact.profileImg || "https://via.placeholder.com/50"}
            alt={contact.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-white font-medium">{contact.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
