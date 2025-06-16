import express from "express";
import { streamVideo } from "../controllers/VideoController";

const router = express.Router();

router.get("/:videoName", streamVideo);

export default router;
