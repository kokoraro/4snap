import { intro, outro, text, select, spinner } from "@clack/prompts";
import storage from "../config/index.js";
import Table from "cli-table";
import chalk from "chalk";
import slugify from "slugify";
import { sleep } from "../helpers/index.js";
import { createCmds } from "../helpers/http.js";

export default async function createCommand() {
  intro(chalk.bgBlueBright(chalk.whiteBright(" qwik commands ")));
  const s = spinner();
  try {
    // command name
    const cmdName = await text({
      message: "Command name: ",
      placeholder: "create-project",
      validate(value) {
        if (value.length === 0) return `Value is required!`;
      },
    });

    // public / private
    const isPublic = await select({
      message: "Available to public?.",
      options: [
        { value: "public", label: "Public" },
        { value: "private", label: "Private" },
      ],
      initialValue: "public",
    });

    // list of commands
    const commandList = await text({
      message: "Command lists separted by comma (,): ",
      placeholder: "mkdir name, cd name, code . ",
      validate(value) {
        if (value.length === 0) return `Value is required!`;
      },
    });

    // @ts-ignore
    const cliName = slugify(cmdName, { lower: true, trim: true });
    const Pub = isPublic === "public" ? true : false;
    const commands = commandList;

    s.start("Creating Command..");

    await sleep(1);

    const resp = await createCmds({
      name: cliName,
      public: Pub,
      command: commands,
    });

    if (
      [
        "--createCliCommand/invalid-fields",
        "--auth/authorization-token-notfound",
        "--auth/invalid-token",
        "--createCliCommand/name-exists",
      ].includes(resp?.code)
    ) {
      s.stop(`🚩 ${chalk.redBright(resp?.message)}`);
    }

    if (["--createCliCommand/success"].includes(resp?.code)) {
      s.stop(`✅ ${chalk.greenBright(resp?.message)}`);
      const data = resp?.data;
      const prevCmds = (storage.get("@qwik_commands") as string[]) ?? [];
      const comb = [...prevCmds, data];
      storage.set("@qwik_commands", comb);

      //   print message
      console.log("\t ");
      console.log(
        "\t" + chalk.bgBlueBright(chalk.whiteBright(` qwik run ${data?.name} `))
      );
    }
  } catch (e: any) {
    s.stop(`${chalk.redBright("Something went wrong, Try again later.")}`);
  }
  outro("Done");
}
