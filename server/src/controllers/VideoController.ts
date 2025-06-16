// controllers/videoController.ts
import { Request, Response } from "express";
import { getHlsFileStream } from "../services/VideoService";

export const streamHlsVideo = (req: Request, res: Response): void => {
  const fileName = req.params.filename;

  try {
    const { stream, contentType } = getHlsFileStream(fileName);

    res.setHeader("Content-Type", contentType);
    stream.pipe(res);
  } catch (error) {
    res.status(404).json({ error: "File not found" });
  }
};
