import "./ChatWindow.css";

import { useEffect, useRef, useState } from "react";

import {
  getMessages,
  sendMessage,
} from "../../services/chatService";

import { getImageUrl } from "../../utils/imageHelper";

function ChatWindow({ conversation }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!conversation) return;

    loadMessages();
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

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      await sendMessage(
        conversation.id,
        text
      );

      setText("");

      loadMessages();

    } catch (err) {
      console.log(err);
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
          <span>@{conversation.other_user.username}</span>
        </div>

      </div>

      <div className="chat-body">

        {messages.map((message) => {

          const isMe =
            message.sender === currentUser.username;

          return (
            <div
              key={message.id}
              className={`message-row ${
                isMe ? "me" : "other"
              }`}
            >
              <div
                className={`message-bubble ${
                  isMe ? "my-message" : "other-message"
                }`}
              >
                <p>{message.text}</p>

                <span>
                  {new Date(
                    message.created_at
                  ).toLocaleTimeString([], {
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
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Type a message..."
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatWindow;