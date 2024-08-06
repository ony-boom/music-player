import * as id3 from "node-id3";
import * as fs from "https://deno.land/std@0.224.0/fs/mod.ts";

self.onmessage = async (event) => {
	
  const { musicDir } = event.data as { musicDir: string };

  const audioFilesExtensions = ["mp3", "m4a", "flac", "wav", "ogg"];
  const audios = fs.walk(musicDir, {
    exts: audioFilesExtensions,
    includeDirs: false,
  });

  for await (const audio of audios) {
    const audioTag = id3.read(audio.path);
    self.postMessage({ audioFile: audio, audioTag });
  }
};

declare const self: Worker;
