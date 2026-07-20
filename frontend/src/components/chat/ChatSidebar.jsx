import "./ChatSidebar.css";
import { getImageUrl } from "../../utils/imageHelper";

function ChatSidebar({
  users,
  conversations,
  selectedConversation,
  setSelectedConversation,
  startChat,
}) {
  return (
    <div className="chat-sidebar">
      <h2>Chats</h2>

      {/* Existing Conversations */}
      {conversations.length > 0 && (
        <>
          <h4 className="chat-section-title">Recent Chats</h4>

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`chat-user ${
                selectedConversation?.id === conversation.id ? "active" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <img
                src={getImageUrl(conversation.other_user.profile_picture)}
                alt=""
              />

              <div className="chat-user-info">
                <h4>{conversation.other_user.full_name}</h4>

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
        </>
      )}

      {/* All Users */}
      <h4 className="chat-section-title">People</h4>

      {users.map((user) => (
        <div
          key={user.id}
          className="chat-user"
          onClick={() => startChat(user)}
        >
          <img
            src={getImageUrl(user.profile_picture)}
            alt=""
          />

          <div className="chat-user-info">
            <h4>{user.full_name}</h4>

            <span>Start chatting...</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatSidebar;