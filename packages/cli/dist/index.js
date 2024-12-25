import { Command } from "commander";
import { authCliApp, whoami } from "./commands/index.js";
const program = new Command();
program
    .command("login")
    .alias("l")
    .description("Authenticate cli with Qwik token.")
    .action(authCliApp);
program
    .command("whoami")
    .alias("wmi")
    .description("Check user information.")
    .action(whoami);
program.parse();
