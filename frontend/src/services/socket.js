
let socket = null;

export const connectSocket = (conversationId) => {

  if (socket) {
    socket.close();
  }

  const token = localStorage.getItem("access_token");

  const WS_BASE =
    import.meta.env.VITE_WS_URL ||
    "ws://127.0.0.1:8000/ws/chat/";

  socket = new WebSocket(
    `${WS_BASE}${conversationId}/?token=${token}`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onclose = (e) => {
    console.log("❌ WebSocket Closed", e);
  };

  socket.onerror = (e) => {
    console.log("Socket Error:", e);
  };

  return socket;
};

export const getSocket = () => socket;