import "./ChatWindow.css";
import { useEffect, useRef, useState } from "react";
import {
  getMessages,
  markMessagesRead,
} from "../../services/chatService";
import { getImageUrl } from "../../utils/imageHelper";
import { connectSocket, getSocket } from "../../services/socket";

function ChatWindow({ conversation, refreshConversations }) {
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
  }, [loadMessages]);
  

  useEffect(() => {
    if (!conversation) return;
    setUserStatus({
      is_online: conversation.other_user.is_online,
      last_seen: conversation.other_user.last_seen,
    });
  }, [conversation]);


useEffect(() => {
  if (!conversation) return;

  const socket = connectSocket(conversation.id);

  socketRef.current = socket;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("WS", data);

    switch (data.type) {
      case "typing":
        if (data.username !== currentUser.username) {
          setIsTyping(data.typing);
        }
        return;

      case "status":
        if (data.username === conversation.other_user.username) {
          setUserStatus({
            is_online: data.is_online,
            last_seen: data.last_seen,
          });
        }
        return;

      case "conversation_update":
        refreshConversations?.();
        return;

      case "read":
        setMessages((prev) =>
          prev.map((msg) =>
            data.message_ids.includes(msg.id)
              ? {
                  ...msg,
                  is_read: true,
                }
              : msg
          )
        );
        return;

      default:
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.id)) {
            return prev;
          }

          return [...prev, data];
        });

        refreshConversations?.();
    }
  };

  socket.onclose = () => {
    console.log("Disconnected");
  };

  return () => {
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onopen = null;
  };
}, [conversation, refreshConversations]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadMessages = useCallback(async () => {
    if (!conversation) return;

    try {
      const response = await getMessages(conversation.id);

      setMessages(response.data);

      try {
        await markMessagesRead(conversation.id);
      } catch {}

      const unreadIds = response.data
        .filter(
          (m) =>
            !m.is_read &&
            (m.sender?.username || m.sender) !== currentUser.username,
        )
        .map((m) => m.id);

      if (unreadIds.length) {
        const socket = socketRef.current;

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "read",
              message_ids: unreadIds,
            }),
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [conversation]);


 const handleSend = () => {
  if (!text.trim()) return;

  const socket = socketRef.current;

  if (!socket) {
    console.log("❌ Socket not found");
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.log("❌ Socket not connected");
    return;
  }

  socket.send(
    JSON.stringify({
      text: text.trim(),
    })
  );

  socket.send(
    JSON.stringify({
      type: "typing",
      typing: false,
    })
  );

  setText("");

  refreshConversations?.();
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
                      <small
                        className={
                          message.is_read ? "read-status" : "message-status"
                        }
                      >
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

  const socket = socketRef.current;

  if (!socket) return;

  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      type: "typing",
      typing: true,
    })
  );

  clearTimeout(typingTimeout.current);

  typingTimeout.current = setTimeout(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "typing",
          typing: false,
        })
      );
    }
  }, 1000);
}}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
