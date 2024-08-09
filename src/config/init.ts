import * as os from "os";
import * as path from "path";
import { existsSync } from "fs";
import { mkdir } from "node:fs/promises";
import type { Config, ConfigFile } from "./types";
// @ts-ignore
import defaultConfig from "./default.toml";

const setConfigPath = async () => {
  const configBaseDir =
    Bun.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");
  const configPath = path.join(configBaseDir, "music-player");

  if (!existsSync(configPath)) {
    try {
      await mkdir(configPath, { recursive: true });
    } catch (e) {
      console.error("Can't create config dir.", e);
      process.exit(1);
    }
  }

  return configPath;
};

const initConfig = async (): Promise<Config> => {
  const configPath = await setConfigPath();
  const configFilePath = path.join(configPath, "config.toml");

  return {
		path: {
			base: configPath,
			file: configFilePath
		},
	};
};
