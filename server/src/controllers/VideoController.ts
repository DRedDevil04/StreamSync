// controllers/videoController.ts
import { Request, Response } from "express";
import path from "path";

export const getVideo = (req: Request, res: Response) => {
  const { videoName } = req.params;
  const filePath = path.resolve(__dirname, "../../..", "videos/hls", videoName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(404).send("File not found");
    }
  });
};
