#!/usr/bin/env node
import { Command } from "commander";
import {
  authCliApp,
  createCmd,
  execCmd,
  listCommands,
  shareCmd,
  syncCmd,
  viewCmd,
  whoami,
} from "./commands/index.js";
import storage from "./config/index.js";
import chalk from "chalk";

const program = new Command();

program
  .command("login")
  .alias("l")
  .description("Authenticate cli with 4snap token.")
  .action(authCliApp);

program
  .command("whoami")
  .alias("wmi")
  .description("Check user information.")
  .action(whoami);

program
  .command("create")
  .alias("c")
  .description("create list of commands.")
  .action(createCmd);

program
  .command("list")
  .alias("li")
  .description("list available saved command.")
  .action(listCommands);

program
  .command("sync")
  .alias("sy")
  .description("Synchronize all local command..")
  .action(syncCmd);

program
  .command("view <command>")
  .alias("v")
  .description("View specific command")
  .action(async (command) => {
    await viewCmd(command);
  });

program
  .command("run <command>")
  .option("-p", "Execute a public list")
  .alias("r")
  .description("Execute a command")
  .action(async (command, options) => {
    const isPublic = options.p ? options.p : false;
    await execCmd(isPublic, command);
  });

program
  .command("share <command>")
  .option("-u <user>", "4Snap username")
  .alias("sh")
  .description("Share a command to different user.")
  .action(async (command, options) => {
    const username = options.u ? options.u : null;
    await shareCmd(username, command);
  });

// logout
program
  .command("logout")
  .alias("lg")
  .description("Logout and clear all cached data.")
  .action(() => {
    storage.delete("@4snap_cmd");
    storage.delete("@authToken");
    storage.delete("@userInfo");

    console.log(chalk.yellowBright(`\n ✨ Successfully logout. \n`));
  });

program.parse();
