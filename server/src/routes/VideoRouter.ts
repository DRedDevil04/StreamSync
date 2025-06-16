import * as express from "express";
import { Request, Response } from "express";
import path from "path";
import { streamHlsVideo } from "../controllers/VideoController";

const router = express.Router();

router.get("/:videoName", (req: Request, res: Response) => {
  const { videoName } = req.params;
  const filePath = path.resolve(__dirname, "../../..", "videos/hls", videoName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(404).send("File not found");
    }
  });
});

export default router;
