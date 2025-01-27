import { intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";
import storage from "../config/index.js";

interface Comandlist {
  userId: string;
  name: string;
  command: string;
  public: boolean;
}

export default async function viewCommand(commandName: string) {
  console.log("\n");
  intro(chalk.bgBlueBright(chalk.whiteBright(`Executing ${commandName}...`)));

  const sp = spinner();
  sp.start("Starting execution..");

  const localCmds = (storage.get("@4snap_cmd") as Comandlist[]) ?? [];
  if (localCmds.length === 0) {
    console.log(chalk.redBright("No saved commands available."));
    process.exit(1);
  }

  const filteredCmd = localCmds.filter((c) => c.name === commandName);
  if (filteredCmd.length === 0) {
    sp.stop(
      chalk.redBright(`Command with the name '${commandName}' doesn't exist.`)
    );
    outro("Done");
    process.exit(0);
  }

  const command = filteredCmd[0]?.command;

  sp.stop(chalk.yellowBright(`${chalk.bold(chalk.underline(command))} `));
  outro("Done");
}
