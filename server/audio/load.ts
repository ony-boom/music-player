import * as db from "@db";
import * as fs from "@std/fs";
import * as id3 from "node-id3";
import { config } from "@config";
import * as uuid from "@std/uuid";
import { NAMESPACE_URL } from "@std/uuid/constants";

export const load = async () => {
  const audioFilesExtensions = ["mp3", "m4a", "flac", "wav", "ogg"];
  const audios = fs.walk(config.musicDir, {
    exts: audioFilesExtensions,
    includeDirs: false,
  });

  for await (const audio of audios) {
    const audioTag = id3.read(audio.path);
    const id = await uuid.v5.generate(
      NAMESPACE_URL,
      new TextEncoder().encode(audioTag.title ?? audio.name),
    );

	
    db.kv.set(["track", id], {
			playCount: 0,
			path: audio.path,
			genre: audioTag.genre,
			album: audioTag.album,
			artist: audioTag.artist,
      title: audioTag.title ?? audio.name,
    });
  }
};
