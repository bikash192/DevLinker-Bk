const { Server } = require("socket.io");
const crypto = require("crypto");
const Chat = require("../model/chat");

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
          callback(null, true);
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
    console.log("✅ Socket connected:", socket.id);

    // User joins room
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });
      console.log(`${firstName} joined room: ${roomId}`);
      socket.join(roomId);
    });

    // Send message
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text, photoUrl }) => {
        try {
          
          const roomId = getSecretRoomId({ userId, targetUserId });
          console.log(`💬 ${firstName}: ${text}`);

          // find existing chat between users
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // create if not exists
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // push new message
          chat.messages.push({
            senderId: userId,
            text,
            status: "Sent",
          });

          await chat.save();

          // emit message back to both users in the room
          io.to(roomId).emit("messageReceived", {
            firstName,
            userId,
            text,
            photoUrl:
              photoUrl ||
              "https://img.daisyui.com/images/profile/demo/kenobee@192.webp",
            createdAt: new Date().toISOString(),
          });
        } catch (err) {
          console.error("❌ Error while sending message:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = intialiseSocket;
