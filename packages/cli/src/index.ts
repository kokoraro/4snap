#!/usr/bin/env node
import { Command } from "commander";
import {
  authCliApp,
  createCmd,
  execCmd,
  listCommands,
  shareCmd,
  syncCmd,
  whoami,
} from "./commands/index.js";

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

program.parse();
