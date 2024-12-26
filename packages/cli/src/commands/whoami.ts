import { intro, outro } from "@clack/prompts";
import storage from "../config/index.js";
import Table from "cli-table";
import chalk from "chalk";

export default async function whoami() {
  intro(chalk.bgBlueBright(chalk.whiteBright(" 4snap user information ")));
  const userData = storage.get("@userInfo") as any;

  if (typeof userData === "undefined" || userData === null) {
    console.log(chalk.redBright(`\n >>> Opps, no user info were found.`));
    return;
  }

  const table = new Table({
    rows: [
      ["email", userData?.email],
      ["username", userData?.username],
      ["status", chalk.greenBright("active")],
    ],
  });

  console.log(table.toString());
  outro("Done");
}
