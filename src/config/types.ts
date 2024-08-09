export type ConfigFile = {
  musicDir: string;
  server: {
    port: number;
  };
};

export type Config = {
  path: {
    base: string;
    file: string;
  };
} & ConfigFile;
