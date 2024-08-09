import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const isValidTarget = (targetLike?: string): targetLike is Target => {
  return (
    !targetLike ||
    (targetLike && targetLike === TargetEnum.CLIENT) ||
    targetLike === TargetEnum.SERVER
  );
};

const handleRun = (target?: string) => {
  if (!isValidTarget(target)) {
    console.error(
      `"${target}" is not a valid target, try again without passing any options or either ${TargetEnum.SERVER} or ${TargetEnum.CLIENT}`
    );
    process.exit(1);
  }

  // const targetApp = target ?? "server and client";
};

yargs(hideBin(process.argv))
  .usage("Usage: $0 <command> [options]")
  .command(
    "run [target]",
    "Start 'client' or 'server'",
    (yargs) =>
      yargs.positional("target", {
        description: "Either server, client, or both if ommitted",
        type: "string",
      }),
    (argv) => handleRun(argv.target)
  )
  .parse();

type Target = undefined | TargetEnum;

enum TargetEnum {
  SERVER = "server",
  CLIENT = "client",
}
