import * as path from "@std/path";
import * as uuid from "@std/uuid";
import { configDir } from "@config";
import * as audio from "@music-player/audio";
import { set as setBlob } from "kv-toolbox/blob";
import { NAMESPACE_URL } from "@std/uuid/constants";

export const init = async () => {
  const firstLaunchKey = [
    "servers",
    "state",
    "firstStart",
  ];

  /* const isFirstLaunch = Boolean((await kv.get<boolean>(firstLaunchKey)).value);

  if (!isFirstLaunch) {
    return;
  } */

  audio.load({
    async forEachAudio(audioFile, audioTag) {
      const id = await uuid.v5.generate(
        NAMESPACE_URL,
        new TextEncoder().encode(audioTag.title ?? audioFile.name),
      );

      await kv.set(["track", id], {
        playCount: 0,
        path: audioFile.path,
        genre: audioTag.genre,
        album: audioTag.album,
        artist: audioTag.artist,
        title: audioTag.title ?? audioFile.name,
      });

      const image = typeof audioTag.image === "string"
        ? audioTag.image
        : audioTag.image?.imageBuffer;

      await setBlob(kv, ["cover", id], new Blob([image]));
    },
  });
  await kv.set(firstLaunchKey, true);
};

export const kv = await Deno.openKv(path.join(configDir, "database"));
