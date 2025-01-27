import { isCancel, spinner, text, intro, outro, cancel } from "@clack/prompts";
import { authenticate } from "../helpers/http.js";
import storage from "../config/index.js";
import { sleep } from "../helpers/index.js";
import logger from "../helpers/logger.js";
import chalk from "chalk";

export default async function authCliApp() {
  intro("4snap");
  // const spinner = await showLoading();
  const s = spinner();
  try {
    const userToken = await text({
      message: "Enter your 4snap token: ",
      placeholder: "xxxxxxxxx",
      validate(value): string | void {
        if (value.length === 0) return `Value is required!`;
      },
    });

    if (isCancel(userToken)) {
      cancel("Operation cancelled.");
      process.exit(0);
    }

    // spinner.start("Authenticating..");
    s.start("Authenticating..");

    await sleep(1);

    const resp = await authenticate({ token: userToken });

    if (["--cliAuth/invalid-token"].includes(resp?.code)) {
      s.stop(`🚩 ${chalk.redBright(resp?.message)}`);
    }

    if (["--cliAuth/success"].includes(resp?.code)) {
      s.stop(`✅ ${chalk.greenBright(resp?.message)}`);
      storage.set("@authToken", resp?.data?.token);
      storage.set("@userInfo", {
        username: resp?.data?.username,
        email: resp?.data?.email,
        uId: resp?.data?.userId,
      });
    }
  } catch (e: any) {
    // spinner.fail(`Failed to authenticate, Try again later.`);
    s.stop(`${chalk.redBright("Failed to authenticate, Try again later.")}`);
  }
  outro("Done");
}
