import { Socket } from "socket.io";
import connectionStore from "./ConnectionStore";

const chatSocketEvents = function (socket: Socket, sessionId: string) {
  if (!sessionId) {
    console.error("❌ [Chat] No session ID provided, disconnecting socket.");
    return socket.disconnect();
  }
  const info = connectionStore.get(sessionId);
  socket.on("chatMessage", (message: { user: string; text: string }) => {
    if (info.currentRoom) {
      socket.to(info.currentRoom).emit("chatMessage", {
        user: message.user,
        text: message.text,
        timestamp: new Date().toISOString(),
      });
      console.log(
        `💬 Message from ${message.user}: "${message.text}" in room: ${info.currentRoom}`
      );
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ [Chat] Client disconnected:", socket.id);
  });
};

export default chatSocketEvents;
