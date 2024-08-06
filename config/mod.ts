import * as fs from "@std/fs";
import * as path from "@std/path";
import { homedir } from "node:os";
import * as toml from "@std/toml";
import type { Config } from "./types.ts";

const homeConfig = Deno.env.get("XDG_CONFIG_HOME") ??
  path.join(homedir(), ".config");

export const configDir = path.join(homeConfig, "music-player");

const defaultConfigFilePath = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "default.toml",
);

const configFilePath = path.join(configDir, "config.toml");

if (!fs.existsSync(configFilePath)) {
  try {
    const defaultConfigFile = await Deno.readTextFile(
      defaultConfigFilePath,
    );

    await Deno.mkdir(path.dirname(configFilePath), { recursive: true });
    await Deno.writeTextFile(configFilePath, defaultConfigFile, { create: true });
  } catch (e) {
    console.error("Error occured while creating config file", e);
    Deno.exit(1);
  }
}

let configFile = await Deno.readTextFile(configFilePath);
configFile = configFile.replace(/\$(\w+)/g, (match) => {
  const [_, variable] = match.split("$");
  return Deno.env.get(variable)!;
});

export * from "./types.ts";
export const config = toml.parse(configFile) as Config;
