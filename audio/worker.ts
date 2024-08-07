import fg from "fast-glob";
import * as id3 from "node-id3";
import * as path from "@std/path";

self.onmessage = async (event) => {
  const { musicDir } = event.data as { musicDir: string };

  const audioFilesExtensions = ["mp3", "m4a", "flac", "wav", "ogg"];

  const pattern = `${musicDir}/**/*.{${audioFilesExtensions.join(",")}}`;

  try {
    const files = await fg(pattern);
    for (const [index, file] of files.entries()) {
      const audioTag = id3.read(file);
      const audioFile = {
        path: file,
        name: path.basename(file),
      };

      self.postMessage({ audioFile, audioTag, index, total: files.length });
    }
  } catch {
    self.postMessage("error");
  }
};

declare const self: Worker;
