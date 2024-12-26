import { spinner, text, intro, outro } from "@clack/prompts";
import { authenticate } from "../helpers/http.js";
import storage from "../config/index.js";
import { sleep } from "../helpers/index.js";
import chalk from "chalk";
export default async function authCliApp() {
    intro("qwik");
    const s = spinner();
    try {
        const userToken = await text({
            message: "Enter your qwik token: ",
            placeholder: "xxxxxxxxx",
            validate(value) {
                if (value.length === 0)
                    return `Value is required!`;
            },
        });
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
    }
    catch (e) {
        s.stop(`${chalk.redBright("Failed to authenticate, Try again later.")}`);
    }
    outro("Done");
}
