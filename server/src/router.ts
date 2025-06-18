// router.ts
import * as express from "express";

import videoRoutes from "./routes/VideoRouter";
import authRoutes from "./routes/AuthRoutes";
import { authenticate } from "./middleware/AuthMiddleware";
const router = express.Router();

router.use("/video",authenticate, videoRoutes);
router.use("/auth",authRoutes)

export default router;
