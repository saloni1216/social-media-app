import api from "../api/axios";

export const getUsers = () => {
  return api.get("accounts/users/");
};

export const startConversation = (receiver_id) => {
  return api.post("chat/start/", {
    receiver_id,
  });
};

export const getConversations = () => {
  return api.get("chat/");
};

export const getMessages = (conversationId) => {
  return api.get(`chat/messages/${conversationId}/`);
};

export const sendMessage = (conversation_id, text) => {
  return api.post("chat/send/", {
    conversation_id,
    text,
  });
};