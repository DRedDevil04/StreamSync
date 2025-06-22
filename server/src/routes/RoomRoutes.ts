import express from "express";
import {
  createRoom,
  deleteRoom,
  updateRoomSettings,
  addParticipant,
  removeParticipant,
  getUserRooms
} from "../controllers/RoomControllers.js";
import { authenticate } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createRoom);
router.delete("/:roomId", authenticate, deleteRoom);
router.patch("/:roomId/settings", authenticate, updateRoomSettings);
router.patch("/:roomId/add-participant", authenticate, addParticipant);
router.patch("/:roomId/remove-participant", authenticate, removeParticipant);
router.get("/my-rooms", authenticate, getUserRooms);

export default router;
