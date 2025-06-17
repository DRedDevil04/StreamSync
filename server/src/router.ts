// router.ts
import * as express from "express";

import videoRoutes from "./routes/VideoRouter";
import authRoutes from "./routes/AuthRoutes";

const router = express.Router();

router.use("/video", videoRoutes);
router.use("/auth",authRoutes)

export default router;
