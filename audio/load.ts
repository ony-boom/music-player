import { config } from "@config";
import type * as fs from "@std/fs";
import type * as id3 from "node-id3";

const worker = new Worker(import.meta.resolve("./worker.ts"), {
  type: "module",
});

export const load = ({ forEachAudio }: AudioLoadParams) => {
  worker.postMessage({ musicDir: config.musicDir });
  worker.onmessage = (event) => {
		
    const { audioTag, audioFile } = event.data as {
      audioFile: fs.WalkEntry;
      audioTag: id3.Tags;
    };

    forEachAudio?.(audioFile, audioTag);
  };
};

export type AudioLoadParams = {
  forEachAudio?: (audioFile: fs.WalkEntry, audioTag: id3.Tags) => Promise<void>;
};
