let socket = null;
let currentConversation = null;

export const connectSocket = (conversationId) => {

  // Already connected to same conversation
  if (
      socket &&
      currentConversation === conversationId &&
      socket.readyState === WebSocket.OPEN
  ) {
      return socket;
  }

  // Close only if changing conversation
  if (
      socket &&
      currentConversation !== conversationId
  ) {
      socket.close();
  }

  currentConversation = conversationId;

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
      console.log("Socket Error", e);
  };

  return socket;
};

export const getSocket = () => socket;

















// let socket = null;

// export const connectSocket = (conversationId) => {

//   if (socket) {
//     socket.close();
//   }

//   const token = localStorage.getItem("access_token");

//   const WS_BASE =
//     import.meta.env.VITE_WS_URL ||
//     "ws://127.0.0.1:8000/ws/chat/";

//   socket = new WebSocket(
//     `${WS_BASE}${conversationId}/?token=${token}`
//   );

//   socket.onopen = () => {
//     console.log("✅ WebSocket Connected");
//   };

//   socket.onclose = (e) => {
//     console.log("❌ WebSocket Closed", e);
//   };

//   socket.onerror = (e) => {
//     console.log("Socket Error:", e);
//   };

//   return socket;
// };

// export const getSocket = () => socket;