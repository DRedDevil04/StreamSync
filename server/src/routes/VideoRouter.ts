import * as express from "express";
import { getVideo } from "../controllers/VideoController";

const router = express.Router();

router.get("/:videoName", getVideo);

export default router;
