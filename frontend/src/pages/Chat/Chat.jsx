import "./Chat.css";

import { useEffect, useState } from "react";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";

import { getConversations } from "../../services/chatService";

function Chat() {

  const [conversations, setConversations] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

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

  return (
    <>
      <Navbar />

      <div className="chat-page">

        <Sidebar />

        <div className="chat-container">

          <ChatSidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
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