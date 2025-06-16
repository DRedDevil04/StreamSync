// router.ts
import express from "express";

import videoRoutes from "./routes/VideoRouter";

const router = express.Router();

router.use("/video", videoRoutes);

export default router;
