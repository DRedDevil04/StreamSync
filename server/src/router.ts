// router.ts
import * as express from "express";

import videoRoutes from "./routes/VideoRouter";
import authRoutes from "./routes/AuthRoutes";
import friendsRoutes from "./routes/FriendsRoutes";
import userRoutes from "./routes/UserRoutes";
import groupRoutes from "./routes/GroupRoutes";
import roomRoutes from "./routes/RoomRoutes";
import movieRoutes from "./routes/MovieRoutes";
import { authenticate } from "./middleware/AuthMiddleware";
const router = express.Router();

// router.use("/video",authenticate, videoRoutes);
router.use("/video", videoRoutes);
router.use("/auth", authRoutes);
router.use("/connections", friendsRoutes);
router.use("/user", userRoutes);
router.use("/group", groupRoutes);
router.use("/room", roomRoutes);
router.use("/movie", movieRoutes);

export default router;
