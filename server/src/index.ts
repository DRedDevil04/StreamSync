import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import * as dotenv from "dotenv";
import routes from "./router";
import "./config/dbConfig.js"; // adjust path as needed
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());

// Create Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow connections from any origin (or set to "http://localhost:1235")
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// Optional: Serve video files statically (if needed)
app.use("/videos", express.static("videos"));

// Serve public folder (for testing)
app.use(express.static("public"));

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("play", () => {
    socket.broadcast.emit("play");
  });

  socket.on("pause", () => {
    socket.broadcast.emit("pause");
  });

  socket.on("seek", (time: number) => {
    socket.broadcast.emit("seek", time);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
