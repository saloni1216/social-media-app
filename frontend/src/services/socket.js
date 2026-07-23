let socket = null;
let currentConversationId = null;

export const connectSocket = (conversationId) => {

  if (
    socket &&
    currentConversationId === conversationId &&
    (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    )
  ) {
    return socket;
  }

  if (
    socket &&
    currentConversationId !== conversationId
  ) {
    socket.close();
  }

  currentConversationId = conversationId;

  const token = localStorage.getItem("access_token");

 const WS_BASE =
  import.meta.env.VITE_WS_URL ||
  (window.location.protocol === "https:"
    ? "wss://social-media-app-backend-efsz.onrender.com/ws/chat/"
    : "ws://127.0.0.1:8000/ws/chat/");

  socket = new WebSocket(
    `${WS_BASE}${conversationId}/?token=${token}`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onclose = (event) => {
    console.log("❌ WebSocket Closed", event);
  };

  socket.onerror = (event) => {
    console.log("❌ Socket Error", event);
  };

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
    currentConversationId = null;
  }
};