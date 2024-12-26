import { intro, outro, text, select } from "@clack/prompts";
import chalk from "chalk";
export default async function createCommand() {
    intro(chalk.bgBlueBright(chalk.whiteBright(" qwik commands ")));
    try {
        const commmandName = await text({
            message: "Command name: ",
            placeholder: "create-project",
            validate(value) {
                if (value.length === 0)
                    return `Value is required!`;
            },
        });
        const isPublic = await select({
            message: "Available to public?.",
            options: [
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
            ],
        });
    }
    catch (e) { }
    outro("Done");
}
