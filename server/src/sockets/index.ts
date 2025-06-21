import { Server } from "socket.io";
import chatSocket from "./ChatEvents";
import streamSocket from "./PlaybackEvents";
import connectionStore from "./ConnectionStore";

const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    connectionStore.set(socket.id, {
      currentRoom: null,
      currentTime: null,
      isPlaying: false,
    });
    // Attach feature modules
    chatSocket(socket, socket.id);
    streamSocket(socket, socket.id);
  });
};

export default socketHandler;
