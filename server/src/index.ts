import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import * as dotenv from "dotenv";
import routes from "./router";
import { connectToDatabase } from "./config/dbConfig"; // adjust path as needed
import cors from "cors";
import socketHandler from "./sockets";

dotenv.config();

const app = express();
const server = http.createServer(app);

const dbUrl ="mongodb+srv://nitu:hello%40123@streamsync.5fuvctt.mongodb.net/?retryWrites=true&w=majority&appName=StreamSync"

if (!dbUrl) {
  console.error("❌ DB_URL is not defined in the environment variables");
  process.exit(1);
}
connectToDatabase(dbUrl);

app.use(cors());

// Create Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // your frontend address
    methods: ["GET", "POST"],
  },
});
console.log(`🔌 Socket.IO server created`);
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
socketHandler(io);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
