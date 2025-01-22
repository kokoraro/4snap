import storage from "../config/index.js";
import { cancel, intro, isCancel, outro, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import { sleep } from "../helpers/index.js";
import shell from "shelljs";
import { directoryExists } from "../helpers/fileManager.js";
import { getCmdByName } from "../helpers/http.js";
import spawn from "cross-spawn";
import { exec, execSync } from "node:child_process";

export default async function executeCmd(
  isPublic: boolean,
  commandName: string
) {
  if (isPublic) {
    await executePublicCmd(commandName);
  } else {
    await executeLocalCmd(commandName);
  }
}

interface Comandlist {
  userId: string;
  name: string;
  command: string;
  public: boolean;
}

async function executeLocalCmd(commandName: string) {
  console.log("\n");
  intro(chalk.bgBlueBright(chalk.whiteBright(`Executing ${commandName}...`)));

  const localCmds = (storage.get("@4snap_cmd") as Comandlist[]) ?? [];
  if (localCmds.length === 0) {
    console.log(chalk.redBright("\n No saved commands available. \n"));
    process.exit(1);
  }

  const filteredCmd = localCmds.filter((c) => c.name === commandName);
  if (filteredCmd.length === 0) {
    console.log(
      chalk.redBright(
        `\n Command with the name '${commandName}' doesn't exist. \n`
      )
    );
    process.exit(1);
  }

  const command = filteredCmd[0]?.command;

  if (command.includes("$")) {
    await executeDynamicCommand(command, commandName);
  } else {
    const sp = spinner();
    sp.start("Starting execution..");

    exec(command, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err || stderr) {
        sp.stop(
          chalk.redBright(
            `Failed to execute '${chalk.underline(commandName)}': ${stderr}`
          )
        );
        outro("Done");
        return;
      }

      // output the given output from stdout
      if (stdout) console.log(`\n ${stdout} \n`);

      sp.stop(
        chalk.yellowBright(
          ` ✨ Successfully executed ${chalk.bold(
            chalk.underline(commandName)
          )} `
        )
      );
      outro("Done");
    });
  }
  outro("Done");
}

async function executePublicCmd(commandName: string) {
  console.log("\n");
  intro(
    chalk.bgBlueBright(chalk.whiteBright(`Executing public ${commandName}...`))
  );
  const sp = spinner();
  try {
    const resp = await getCmdByName(commandName);

    sp.start("Fetching public commands...");
    await sleep(1);

    if (["--commandByName/notfound"].includes(resp?.code)) {
      sp.stop(`🚩 ${chalk.redBright(resp?.message)}`);
    }

    if (["--commandByName/success"].includes(resp?.code)) {
      //   sp.stop(`✅ ${chalk.greenBright(resp?.message)}`);
      sp.stop();

      const data = resp?.data;

      const command = data?.command;

      if (command.includes("$")) {
        await executeDynamicCommand(command, commandName);
      } else {
        const sp = spinner();
        sp.start("Starting execution.. \n");

        // execute command
        exec(command, { cwd: process.cwd() }, (err, stdout, stderr) => {
          if (err || stderr) {
            sp.stop(
              chalk.redBright(
                `Failed to execute '${chalk.underline(commandName)}': ${stderr}`
              )
            );
            outro("Done");
            return;
          }

          // output the given output from stdout
          if (stdout) console.log(`\n ${stdout} \n`);

          sp.stop(
            chalk.yellowBright(
              ` ✨ Successfully executed ${chalk.bold(
                chalk.underline(commandName)
              )} `
            )
          );
          outro("Done");
        });
      }
    }
  } catch (e: any) {
    sp.stop(`${chalk.redBright("Something went wrong, Try again later.")}`);
  }
  outro("Done");
}

async function executeDynamicCommand(cmd: string, cmdName: string) {
  const splittedCmd = cmd.split(",");
  let splittedDyVar = [];
  let count = 0;
  let mergedCmd = "";
  const sp = spinner();

  // extract dynamic variable's from command
  splittedCmd.forEach((cmd) => {
    const dVar = cmd.split(" ").filter((v) => v.startsWith("$"));
    dVar.forEach((v) => {
      if (!splittedDyVar.includes(v)) {
        splittedDyVar.push(v);
      }
    });
  });

  // construct an executable command
  while (count < splittedDyVar.length) {
    const v = splittedDyVar[count];
    const dynamicVarInp = await text({
      message: `${v.length === 1 ? "Variable name" : v.replace("$", "")}`,
      placeholder: "value",
      validate(value): string | void {
        if (value.length === 0) return `Value is required!`;
      },
    });

    if (isCancel(dynamicVarInp)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    count++;

    if (mergedCmd.length === 0) {
      mergedCmd = splittedCmd.join(" &&").replace(v, dynamicVarInp);
    }
    if (mergedCmd.length > 0) {
      mergedCmd = mergedCmd.replace(v, dynamicVarInp);
    }
  }

  sp.start("Starting execution");

  await sleep(1);

  // ! Still trying to work around toward executing commmands that requires input from stdinp / stdout.
  exec(mergedCmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err || stderr) {
      sp.stop(
        chalk.redBright(
          `Failed to execute '${chalk.underline(cmdName)}': ${stderr}`
        )
      );
      outro("Done");
    }
    console.log(stdout);
    if (stdout) {
      sp.stop(
        chalk.redBright(
          `Failed to execute '${chalk.underline(cmdName)}' command.`
        )
      );
      outro("Done");
    }
  });
}
