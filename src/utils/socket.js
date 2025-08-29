const { Server } = require("socket.io");
const crypto = require("crypto");

const allowedOrigins = [
  "https://dev-linker-web.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const intialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);   // ✅ allow
        } else {
          console.error("Socket.io CORS blocked for:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Handle Events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });  // ✅ fix argument
      console.log(firstName + " joined room: " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text, photoUrl }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });  // ✅ fix argument
      console.log(`${firstName}: ${text}`);

      const messageData = {
        firstName,
        userId,
        text,
        photoUrl: photoUrl || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
        createdAt: new Date().toISOString(),
      };

      io.to(roomId).emit("messageReceived", messageData);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = intialiseSocket;
