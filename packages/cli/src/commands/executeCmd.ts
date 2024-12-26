import storage from "../config/index.js";
import { cancel, intro, isCancel, outro, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import { sleep } from "../helpers/index.js";
import shell from "shelljs";
import { directoryExists } from "../helpers/fileManager.js";
import { getCmdByName } from "../helpers/http.js";

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

    if (shell.exec(command.split(",").join(" && ")).code === 0) {
      sp.stop(
        chalk.yellowBright(
          ` ✨ Successfully executed ${chalk.bold(
            chalk.underline(commandName)
          )} `
        )
      );
    } else {
      sp.stop(chalk.redBright(`\n Failed to execute '${commandName}'!. \n`));
    }
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

        if (shell.exec(command.split(",").join(" && ")).code === 0) {
          sp.stop(
            chalk.yellowBright(
              ` ✨ Successfully executed ${chalk.bold(
                chalk.underline(commandName)
              )} `
            )
          );
        } else {
          sp.stop(
            chalk.redBright(`\n Failed to execute '${commandName}'!. \n`)
          );
        }
      }
    }
  } catch (e: any) {
    sp.stop(`${chalk.redBright("Something went wrong, Try again later.")}`);
  }
  outro("Done");
}

async function executeDynamicCommand(cmd: string, cmdName: string) {
  const splittedCmd = cmd.split(",");
  let dynamicVarName = "";
  let ecmd = [];
  const sp = spinner();
  for (let i = 0; i < splittedCmd.length; i++) {
    const dVar = splittedCmd[i].split(" ").filter((v) => v.startsWith("$"));
    const containDVar = splittedCmd[i].includes("$");
    if (containDVar && i === 0) {
      const dynamicVarInp = await text({
        message: `${
          dVar[i].length === 1 ? "Variable name" : dVar[i].replace("$", "")
        }`,
        placeholder: "project-name",
        validate(value): string | void {
          if (value.length === 0) return `Value is required!`;
        },
      });

      if (isCancel(dynamicVarInp)) {
        cancel("Operation cancelled.");
        process.exit(0);
      }

      dynamicVarName = dynamicVarInp as string;
    }

    const formattedCommand = splittedCmd[i].replace(
      /\$(?!\w+)/g,
      dynamicVarName
    );
    ecmd.push(formattedCommand);
  }

  const joinedCmd = ecmd.join(" && ");

  sp.start("Starting execution..");

  // check if directory name exists.
  const dirExists = directoryExists(dynamicVarName);

  if (dirExists) {
    sp.stop(
      chalk.redBright(
        `\n Failed to execute '${cmdName}'!, ${dynamicVarName} already exist. \n`
      )
    );
    process.exit(1);
  }

  await sleep(1);

  if (shell.exec(joinedCmd).code === 0) {
    sp.stop(
      chalk.yellowBright(
        ` ✨ Successfully executed ${chalk.bold(chalk.underline(cmdName))} `
      )
    );
  } else {
    sp.stop(chalk.redBright(`\n Failed to execute '${cmdName}'!. \n`));
  }
}
