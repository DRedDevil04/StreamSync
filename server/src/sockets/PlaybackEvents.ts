const streamSocketEvents = function (io: any) {
  io.on("connection", (socket: any) => {
    console.log("🔌 Client connected:", socket.id);

    let currentRoom: string | null = null;
    let currentTime: number | null = null;
    let isPlaying: boolean = false;

    socket.on("joinRoom", (roomId: string) => {
      if (currentRoom) {
        socket.leave(currentRoom);
        console.log(`🔁 ${socket.id} left room: ${currentRoom}`);
      }
      currentRoom = roomId;
      if (currentTime) isPlaying = false; // Reset playing state when joining a new room
      socket.join(roomId);
      console.log(`➡️ ${socket.id} joined room: ${roomId}`);
    });

    socket.on("play", () => {
      if (currentRoom) {
        socket.to(currentRoom).emit("play");
        console.log(`▶️ ${socket.id} played in room: ${currentRoom}`);
      }
    });

    socket.on("pause", () => {
      if (currentRoom) {
        socket.to(currentRoom).emit("pause");
        console.log(`⏸️ ${socket.id} paused in room: ${currentRoom}`);
      }
    });

    socket.on("seek", (time: number) => {
      if (currentRoom) {
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export default streamSocketEvents;
