import { Command } from "commander";
import { authCliApp } from "./commands/auth.js";

const program = new Command();

program
  .command("login")
  .alias("l")
  .description("Authenticate cli with Qwik token.")
  .action(authCliApp);

program.parse();
