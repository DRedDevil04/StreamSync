import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import * as dotenv from "dotenv";
import routes from "./router";
import { connectToDatabase } from "./config/dbConfig"; // adjust path as needed
import PlaybackEvents from "./sockets/PlaybackEvents.js"; // adjust path as needed
import cors from "cors";

dotenv.config();

const app = express();
const server = http.createServer(app);

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error("❌ DB_URL is not defined in the environment variables");
  process.exit(1);
}
connectToDatabase(dbUrl);

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
PlaybackEvents(io);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
