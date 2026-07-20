import "./Chat.css";

import { useEffect, useState } from "react";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";

import {
  getUsers,
  getConversations,
  startConversation,
} from "../../services/chatService";

function Chat() {
  const [users, setUsers] = useState([]);

  const [conversations, setConversations] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadUsers();
    loadConversations();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await getConversations();

      setConversations(response.data);

      if (response.data.length > 0) {
        setSelectedConversation(response.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartChat = async (user) => {
    try {
      const response = await startConversation(user.id);

      setSelectedConversation(response.data);

      loadConversations();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="chat-page">
        <Sidebar />

        <div className="chat-container">
          <ChatSidebar
            users={users}
            conversations={conversations}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            startChat={handleStartChat}
          />

          <ChatWindow
            conversation={selectedConversation}
          />
        </div>
      </div>
    </>
  );
}

export default Chat;