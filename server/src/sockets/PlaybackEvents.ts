import { Socket } from "socket.io";
import connectionStore from "./ConnectionStore";

const streamSocketEvents = function (socket: Socket, sessionId: string) {
  if (!sessionId) {
    console.error("❌ [Chat] No session ID provided, disconnecting socket.");
    return socket.disconnect();
  }
  const info = connectionStore.get(sessionId);

  socket.on("joinRoom", (roomId: string) => {
    if (info.currentRoom) {
      socket.leave(info.currentRoom);
      console.log(`🔁 ${socket.id} left room: ${info.currentRoom}`);
    }
    info.currentRoom = roomId;
    // if (currentTime) isPlaying = false; // Reset playing state when joining a new room
    socket.join(roomId);
    console.log(`➡️ ${socket.id} joined room: ${roomId}`);
  });

  socket.on("play", () => {
    if (info.currentRoom) {
      socket.to(info.currentRoom).emit("play");
      console.log(`▶️ ${socket.id} played in room: ${info.currentRoom}`);
    }
  });

  socket.on("pause", () => {
    if (info.currentRoom) {
      socket.to(info.currentRoom).emit("pause");
      console.log(`⏸️ ${socket.id} paused in room: ${info.currentRoom}`);
    }
  });

  socket.on("seek", (time: number) => {
    if (info.currentRoom) {
      socket.to(info.currentRoom).emit("seek", time);
      console.log(
        `⏩ ${socket.id} seeked to ${time}s in room: ${info.currentRoom}`
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
};

export default streamSocketEvents;
