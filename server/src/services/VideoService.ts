// services/videoService.ts
import fs from "fs";

interface VideoStream {
  start: number;
  end: number;
  contentLength: number;
  contentType: string;
  stream: fs.ReadStream;
}

export const getVideoStreamRange = (
  videoPath: string,
  rangeHeader: string
): VideoStream => {
  const videoSize = fs.statSync(videoPath).size;

  const parts = rangeHeader.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

  const contentLength = end - start + 1;
  const stream = fs.createReadStream(videoPath, { start, end });

  return {
    start,
    end,
    contentLength,
    contentType: "video/mp4", // you can dynamically detect with mime-types lib
    stream,
  };
};
