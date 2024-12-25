import { isCancel, cancel, text, intro } from "@clack/prompts";
import showLoading from "../helpers/loader.js";
import { authenticate } from "../helpers/http.js";
import {
  checkInvalidToken,
  checkServerError,
} from "../helpers/serverResponse.js";
import storage from "../config/index.js";

export default async function authCliApp() {
  intro("qwik");
  const spinner = await showLoading();
  try {
    const userToken = await text({
      message: "Enter your qwik token: ",
      placeholder: "xxxxxxxxx",
      validate(value) {
        if (value.length === 0) return `Value is required!`;
      },
    });

    spinner.start("Authenticating..");

    const resp = await authenticate({ token: userToken });

    if (["--cliAuth/invalid-token"].includes(resp?.code)) {
      spinner.fail(resp?.message);
    }

    if (["--cliAuth/success"].includes(resp?.code)) {
      spinner.success(resp?.message);
      storage.set("@authToken", resp?.data?.token);
      storage.set("@userInfo", {
        username: resp?.data?.username,
        email: resp?.data?.email,
        uId: resp?.data?.userId,
      });
      process.exit();
    }

    spinner.stop();

    checkServerError(resp);
    checkInvalidToken(resp);
  } catch (e: any) {
    spinner.fail(`Failed to authenticate, Try again later.`);
  }
}
