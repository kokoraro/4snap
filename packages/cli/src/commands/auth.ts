import { isCancel, cancel, text, intro } from "@clack/prompts";
import showLoading from "../helpers/loader.js";
import { authenticate } from "../helpers/http.js";
import {
  checkInvalidToken,
  checkServerError,
} from "../helpers/serverResponse.js";
import logger from "../helpers/logger.js";

export async function authCliApp(token: string) {
  intro("qwik");
  try {
    const LOADING = await showLoading();
    const userToken = await text({
      message: "Qwik Token",
      placeholder: "xxxxxxxxx",
      validate(value) {
        if (value.length === 0) return `Value is required!`;
      },
    });

    LOADING.start("Authenticating..");

    const resp = await authenticate({ token: userToken });

    if (["--cliAuth/invalid-token"].includes(resp?.code)) {
      LOADING.stop(null, resp?.message);
    }

    if (["--cliAuth/success"].includes(resp?.code)) {
      LOADING.stop(resp?.message, null);
      console.log(resp.data);
    }

    checkServerError(resp);
    checkInvalidToken(resp);
  } catch (e: any) {
    console.log(`Error authenticating user: ${e.message}`);
  }
}
