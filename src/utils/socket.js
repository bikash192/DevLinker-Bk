const { Server } = require("socket.io");

const allowedOrigins = [
  "https://dev-linker-web.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
];

const intialiseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });
    io.on("connection",(socket)=>{
        // Handle Events

        socket.on("joinChat",({firstName,userId,targetUserId})=>{
          const roomId=[userId,targetUserId].sort().join("_");
          console.log(firstName+"JoinedRoom: "+ roomId);
          socket.join(roomId);
        })  
        socket.on("sendMessage",()=>{

        })

        socket.on("disconnect",()=>{

        })
    })
}
module.exports=intialiseSocket;