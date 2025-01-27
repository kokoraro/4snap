import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  spinner,
} from "@clack/prompts";
import storage from "../config/index.js";
import chalk from "chalk";
import { getAllCmds, shareCliCmd } from "../helpers/http.js";
import { sleep } from "../helpers/index.js";

export default async function shareCommand(username: string, command: string) {
  console.log("\n");
  intro(chalk.bgBlueBright(chalk.whiteBright("  Share 4Snap command.. ")));
  const spn = spinner();
  try {
    if (username === null) {
      console.log(chalk.redBright(`\n 4Snap 'username' is missing. \n`));
      process.exit(0);
    }

    if (command === null) {
      console.log(chalk.redBright(`\n 4Snap 'command' is missing. \n`));
      process.exit(0);
    }

    spn.start(
      chalk.yellowBright(` Sharing ${chalk.bold(command)} command ...`)
    );

    await sleep(1);
    const resp = await shareCliCmd({ username, cmdName: command });

    if (resp?.code === "--auth/invalid-token") {
      spn.stop(chalk.redBright(`\n Please login to continue.`));
    }

    if (
      [
        "--shareCliCmd/invalid-fields",
        "--shareCliCmd/user-notfound",
        "--shareCliCmd/command-notfound",
        "--shareCliCmd/command-found",
        "--api/server-error",
      ].includes(resp?.code)
    ) {
      spn.stop(chalk.redBright(`${resp?.message}`));
    }

    if (resp?.code === "--shareCliCmd/success") {
      await sleep(1);
      spn.stop(chalk.yellowBright(` ✨ ${resp?.message}`));
    }
  } catch (e: any) {
    spn.stop(chalk.redBright(`\n Sharing failed. Something went wrong. \n`));
  }
  outro("Done");
}
