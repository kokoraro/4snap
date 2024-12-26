import { intro, outro, text, select } from "@clack/prompts";
import storage from "../config/index.js";
import Table from "cli-table";
import chalk from "chalk";

export default async function createCommand() {
  intro(chalk.bgBlueBright(chalk.whiteBright(" qwik commands ")));
  try {
    // command name
    const commmandName = await text({
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
    });
  } catch (e: any) {}
  outro("Done");
}
