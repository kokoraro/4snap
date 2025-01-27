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
import { getAllCmds } from "../helpers/http.js";
import { sleep } from "../helpers/index.js";

export default async function syncCmd() {
  console.log("\n");
  intro(chalk.bgBlueBright(chalk.whiteBright("  Synchronization starting.. ")));
  const spn = spinner();
  try {
    const resp = await getAllCmds();

    spn.start(chalk.yellowBright(` Synchronizing...`));

    if (resp?.code === "--auth/invalid-token") {
      spn.stop(chalk.redBright(`\n Please login to continue. \n`));
    }

    const data = resp?.data;

    if (data.length === 0) {
      spn.stop(
        chalk.yellowBright(
          `\n Commands synchronizing from server is currently empty. \n`
        )
      );
      const shouldContinue = await confirm({
        message: "Do you wish to continue?",
      });

      // if CTRL-C is pressed
      if (isCancel(shouldContinue)) {
        cancel(chalk.redBright(`\n Operation cancelled.`));
        process.exit(0);
      }

      if (shouldContinue === true) {
        spn.start(chalk.yellowBright(` Synchronizing...`));
        await sleep(1);
        storage.set("@4snap_cmd", data);
        spn.stop(chalk.yellowBright(` ✨ Synchronization completed ... \n`));
      }

      if (shouldContinue === false) {
        cancel(chalk.redBright(`\n Operation cancelled.`));
      }
    }

    // This section would have been refectored, but it kept this way
    //  for the outro() method to be invoked.
    if (data.length > 0) {
      await sleep(1);
      storage.set("@4snap_cmd", data);
      spn.stop(chalk.yellowBright(` ✨ Synchronization completed...\n`));
    }
  } catch (e: any) {
    spn.stop(
      chalk.redBright(`\n Synchronization failed. Something went wrong. \n`)
    );
  }
  outro("Done");
}
