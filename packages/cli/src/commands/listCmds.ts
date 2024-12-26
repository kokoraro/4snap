import storage from "../config/index.js";
import Table from "cli-table";
import chalk from "chalk";

interface SavedCommad {
  name: string;
  public: boolean;
  command: string;
}

export default async function listCommands() {
  const table = new Table({
    head: [
      chalk.cyanBright("s/n"),
      chalk.cyanBright("Name"),
      chalk.cyanBright("Command"),
      chalk.cyanBright("Public"),
    ],
  });
  const savedCmd = (storage.get("@qwik_commands") as SavedCommad[]) ?? [];

  savedCmd.forEach((c, i) => {
    const comb = [
      i,
      c.name,
      chalk.bold(chalk.italic(` qwik run ${c.name} `)),
      c.public ? "🟢" : "🔴",
    ];
    table.push(comb);
  });

  console.log(table.toString());
}
