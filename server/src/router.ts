// router.ts
import * as express from "express";

import videoRoutes from "./routes/VideoRouter";
import authRoutes from "./routes/AuthRoutes";
import friendsRoutes from "./routes/FriendsRoutes";
import userRoutes from "./routes/UserRoutes"; // Assuming you have a UserRoutes file
import groupRoutes from "./routes/GroupRoutes";
import { authenticate } from "./middleware/AuthMiddleware";
const router = express.Router();

// router.use("/video",authenticate, videoRoutes);
router.use("/video", videoRoutes);
router.use("/auth", authRoutes);
router.use("/connections", friendsRoutes);
router.use("/user", userRoutes);
router.use("/group", groupRoutes);

export default router;
