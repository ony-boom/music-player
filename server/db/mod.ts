import * as audio from "@audio";
import * as path from "@std/path";
import { configDir } from "@config";

export const init = async () => {
  const key = [
    "servers",
    "state",
    "firstStart",
  ];

  const _isFirstLaunch = Boolean((await kv.get<boolean>(key)).value);

  /*// TODO: uncomment this
	 * if (!isFirstLaunch) {
    return;
  } */

  //TODO: fill track db here
  await audio.load();
  await kv.set(key, true);
};

export const kv = await Deno.openKv(path.join(configDir, "database"));
