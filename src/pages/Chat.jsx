import React, { useState, useEffect } from "react";
import axios from "axios";
import socket from "../utils/socket"; // your singleton
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import ChatInputBox from "../components/ChatInputBox";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("authToken");

  // ✅ 1) Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 2) Fetch chat history
  const fetchMessages = async (contact) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/chat/history?recipientId=${contact._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 3) Send message: push to self immediately + server will emit to recipient only
  const handleSend = async (content) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/chat/send`,
        { recipientId: activeContact._id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMsg = res.data.chatMessage;

      // ✅ Push to self immediately:
    //   setMessages((prev) => [...prev, newMsg]);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ 4) Setup socket: register once, listen properly
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("register", user.id);
      console.log("✅ Registered socket for:", user.id);
    });

    const handleIncoming = (payload) => {
        console.log("📥 Incoming message:", payload);

        if (
            activeContact && (
            payload.sender === activeContact._id ||
            payload.sender === user.id
            )
        ) {
            setMessages((prev) => [
            ...prev,
            {
                sender: { _id: payload.sender },
                recipient: { _id: user.id },
                content: payload.content,
                createdAt: new Date().toISOString(),
            },
            ]);
        }
        };


    socket.on("messageReceived", handleIncoming);

    // Cleanup
    return () => {
      socket.off("messageReceived", handleIncoming);
    };
  }, [activeContact]);

  // ✅ Initial friends
  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ Load chat on contact change
  useEffect(() => {
    if (activeContact) fetchMessages(activeContact);
  }, [activeContact]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <ChatSidebar
        contacts={contacts}
        activeContact={activeContact}
        onSelect={setActiveContact}
      />
      <div className="flex flex-col flex-1">
        {activeContact ? (
          <>
            <div className="px-4 py-3 bg-gray-800/50 border-b border-blue-500/20 text-white font-bold text-lg">
              {activeContact.username}
            </div>
            <ChatWindow messages={messages} userId={user.id} />
            <ChatInputBox onSend={handleSend} />
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-white text-xl">
            Select a contact to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
