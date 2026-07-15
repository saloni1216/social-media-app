import "./ChatSidebar.css";

import { getImageUrl } from "../../utils/imageHelper";

function ChatSidebar({

  conversations,

  selectedConversation,

  setSelectedConversation,

}) {

  return (

    <div className="chat-sidebar">

      <h2>Chats</h2>

      {conversations.length === 0 && (

        <p className="empty-chat-list">
          No conversations yet
        </p>

      )}

      {conversations.map((conversation) => (

        <div
          key={conversation.id}
          className={`chat-user ${
            selectedConversation?.id === conversation.id
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedConversation(conversation)
          }
        >

          <img
            src={getImageUrl(
              conversation.other_user.profile_picture
            )}
            alt=""
          />

          <div className="chat-user-info">

            <h4>
              {conversation.other_user.full_name}
            </h4>

            <span>

              {conversation.last_message
                ? conversation.last_message.text
                : "Start chatting..."}

            </span>

          </div>

          {conversation.unread_count > 0 && (

            <div className="unread-badge">

              {conversation.unread_count}

            </div>

          )}

        </div>

      ))}

    </div>
  );
}

export default ChatSidebar;