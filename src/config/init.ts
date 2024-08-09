import * as os from "os";
import * as path from "path";
import { existsSync } from "fs";
import { mkdir } from "node:fs/promises";
import type { Config, ConfigFile } from "./types";

export const getConfigPath = async () => {
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

export const initConfigFile = async () => {
  const configPath = await getConfigPath();
  const configFilePath = path.join(configPath, "config.toml");

  if (existsSync(configFilePath)) {
    return configFilePath;
  }

  const defaultConfigFile = Bun.file(
    path.join(import.meta.dir, "default.toml")
  );
  await Bun.write(configFilePath, defaultConfigFile);

  return configFilePath;
};

export const getConfig = async (): Promise<Config> => {
  const configPath = await getConfigPath();
  const configFilePath = await initConfigFile();
  const configFileContent = await Bun.file(configFilePath).text();

  const configFile = Bun.TOML.parse(configFileContent) as ConfigFile;

  return {
    path: {
      file: configFilePath,
      base: configPath,
    },
    ...configFile,
  };
};
