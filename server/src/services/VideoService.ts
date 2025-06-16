// services/videoService.ts
import fs from "fs";
import path from "path";

export const getHlsFileStream = (fileName: string) => {
  const filePath = path.join(__dirname, "../../videos", fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  const stream = fs.createReadStream(filePath);
  const ext = path.extname(fileName);

  let contentType = "application/octet-stream";
  if (ext === ".m3u8") {
    contentType = "application/vnd.apple.mpegurl";
  } else if (ext === ".ts") {
    contentType = "video/MP2T";
  }

  return { stream, contentType };
};
