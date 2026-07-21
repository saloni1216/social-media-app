import "./ChatWindow.css";
import { useEffect, useRef, useState } from "react";

import { getMessages, sendMessage } from "../../services/chatService";

import { getImageUrl } from "../../utils/imageHelper";

import { connectSocket, getSocket } from "../../services/socket";

function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!conversation) return;

    loadMessages();
  }, [conversation]);

  // Connect websocket when conversation changes
  useEffect(() => {
    if (!conversation) return;

    console.log("Conversation", conversation);
    console.log("Conversation id", conversation.id);

    const socket = connectSocket(conversation.id);

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      // Typing event
      if (data.type === "typing") {
        if (data.username !== currentUser.username) {
          setIsTyping(data.typing);
        }

        return;
      }

      // New message
      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    socket.onerror = (error) => {
      console.log("Socket Error:", error);
    };

    return () => {
      socket.close();
    };
  }, [conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await getMessages(conversation.id);

      setMessages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;

    const socket = getSocket();

    console.log("Sending:", text);
    console.log("Socket:", socket);
    console.log("Ready State:", socket?.readyState);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          text: text,
        }),
      );

      // stop typing indicator
      socket.send(
        JSON.stringify({
          type: "typing",
          typing: false,
        }),
      );

      setText("");
    } else {
      console.log("❌ Socket not connected");
    }
  };

  if (!conversation) {
    return (
      <div className="chat-window empty-chat">
        <h2>Select a conversation</h2>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img
          src={getImageUrl(conversation.other_user.profile_picture)}
          alt=""
          className="chat-header-avatar"
        />
        <div>
          <h3>{conversation.other_user.full_name}</h3>

          {isTyping ? (
            <span className="typing-text">Typing...</span>
          ) : (
            <span>@{conversation.other_user.username}</span>
          )}
        </div>
      </div>

      <div className="chat-body">
        {Array.isArray(messages) &&
          messages.map((message) => {
            const isMe =
              message.sender?.username === currentUser.username ||
              message.sender === currentUser.username;

            return (
              <div
                key={message.id}
                className={`message-row ${isMe ? "me" : "other"}`}
              >
                <div
                  className={`message-bubble ${
                    isMe ? "my-message" : "other-message"
                  }`}
                >
                  <p>{message.text}</p>

                  <span>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            const socket = getSocket();

            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: "typing",
                  typing: true,
                }),
              );
            }
          }}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
