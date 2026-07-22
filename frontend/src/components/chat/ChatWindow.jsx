import "./ChatWindow.css";
import { useEffect, useRef, useState } from "react";

import { getMessages, sendMessage } from "../../services/chatService";

import { getImageUrl } from "../../utils/imageHelper";

import { connectSocket, getSocket } from "../../services/socket";

function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userStatus, setUserStatus] = useState({
    is_online: false,
    last_seen: null,
  });
  const bottomRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!conversation) return;

    loadMessages();
  }, [conversation]);

  useEffect(() => {
    if (!conversation) return;

    setUserStatus({
      is_online: conversation.other_user.is_online,
      last_seen: conversation.other_user.last_seen,
    });
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

      if (data.type === "status") {
        if (data.username === conversation.other_user.username) {
          setUserStatus({
            is_online: data.is_online,
            last_seen: data.last_seen,
          });
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
    alert("Send button clicked");

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
          ) : userStatus.is_online ? (
            <span className="online-text">🟢 Online</span>
          ) : (
            <span className="offline-text">
              Last seen{" "}
              {userStatus.last_seen
                ? new Date(userStatus.last_seen).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recently"}
            </span>
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
                  {message.is_deleted ? (
                    <p className="deleted-message">
                      🚫 This message was deleted
                    </p>
                  ) : (
                    <p>{message.text}</p>
                  )}

                  <span>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                    {isMe && (
                      <small className="message-status">
                        {message.is_read
                          ? "✓✓"
                          : message.is_delivered
                            ? "✓✓"
                            : "✓"}
                      </small>
                    )}
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
          placeholder="Type a message..."
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
