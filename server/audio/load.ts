import { config } from "@config";
import type * as id3 from "node-id3";

const worker = new Worker(import.meta.resolve("./worker.ts"), {
  type: "module",
});

export const load = ({ forEachAudio }: AudioLoadParams) => {
  worker.postMessage({ musicDir: config.musicDir });
  worker.onmessage = (event) => {
    const responseData = event.data as ForEachAudioFnParams | string;

    if (typeof responseData === "string") {
      console.error("Can't read music directory");
      Deno.exit(1);
    }

    forEachAudio?.(responseData);
  };
};

type ForEachAudioFnParams = {
  audioFile: { name: string; path: string };
  audioTag: id3.Tags;
  index: number;
  total: number;
};

export type AudioLoadParams = {
  forEachAudio?: (
    params: ForEachAudioFnParams,
  ) => Promise<void>;
};
