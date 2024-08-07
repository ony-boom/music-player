import * as cli from "@std/cli";
import * as path from "@std/path";
import * as uuid from "@std/uuid";
import { configDir } from "@config";
import * as audio from "@music-player/audio";
import { set as setBlob } from "kv-toolbox/blob";
import { NAMESPACE_URL } from "@std/uuid/constants";

const genId = (data: string) =>
  uuid.v5.generate(
    NAMESPACE_URL,
    new TextEncoder().encode(data),
  );

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
  const spinner = new cli.Spinner();
  spinner.start();
  audio.load({
    async forEachAudio({ audioFile, audioTag, index, total }) {
      const id = await genId(audioTag.title ?? audioFile.name);

      await kv.set(["track", id], {
        id,
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

      await setBlob(
        kv,
        ["cover", id],
        new Blob([image], { type: "image/jpeg" }),
      );

      spinner.message = `Loaded ${index} of ${total}`;

      if (index === total - 1) {
        spinner.stop();
        console.log("\n✅ Done\n");
      }
    },
  });
  await kv.set(firstLaunchKey, true);
};

export const kv = await Deno.openKv(path.join(configDir, "database"));
