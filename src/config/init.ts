import * as os from "os";
import * as path from "path";
import { existsSync } from "fs";
import { mkdir } from "node:fs/promises";

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

const initConfig = async () => {}
