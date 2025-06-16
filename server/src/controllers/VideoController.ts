// controllers/videoController.ts
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
// import { fileURLToPath } from "url";
import { getVideoStreamRange } from "../services/VideoService";

export const streamVideo = (req: Request, res: Response): void => {
  const videoName = req.params.videoName;
  const videoPath = path.resolve(__dirname, "../../../video/hls", videoName);

  if (!fs.existsSync(videoPath)) {
    res.status(404).json({ message: "Video not found" });
    return;
  }

  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Requires Range header");
    return;
  }

  const { start, end, contentLength, contentType, stream } =
    getVideoStreamRange(videoPath, range);

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fs.statSync(videoPath).size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": contentType,
  });

  stream.pipe(res);
};
