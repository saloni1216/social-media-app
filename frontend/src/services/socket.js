
let socket = null;
let messageQueue = [];

export const connectSocket = (conversationId) => {

  if (socket) {
    socket.close();
  }

  messageQueue = []; 

  const token = localStorage.getItem("access_token");

  const WS_BASE =
    import.meta.env.VITE_WS_URL ||
    "ws://127.0.0.1:8000/ws/chat/";

  socket = new WebSocket(
    `${WS_BASE}${conversationId}/?token=${token}`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
    messageQueue.forEach((msg) => socket.send(msg));
    messageQueue = [];
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

// Component se seedha socket.send() call karne ki jagah
// isko use karo — yeh readyState khud check karega
export const sendMessage = (payload) => {
  const data = JSON.stringify(payload);

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(data);
  } else {
    console.log("⏳ Socket abhi open nahi hua, message queue mein daal diya");
    messageQueue.push(data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
  messageQueue = [];
};



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