import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { isEmpty } from "../../../util";
import { SettingsModel, UserModel } from "../model";

export default class CliAuthController extends BaseController {
  constructor() {
    super();
  }

  async authenticate(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;

    if (isEmpty(payload) || Object.entries(payload).length === 0) {
      this.error(
        res,
        "--cliAuth/invalid-field",
        "expected a valid token but found none",
        404
      );
      return;
    }

    const token = payload["token"];

    if (isEmpty(token)) {
      this.error(res, "--cliAuth/invalid-token", "Invalid token", 404);
      return;
    }

    const tokenExists = await SettingsModel.find({ token });
    console.log({ tokenExists });

    if (tokenExists.length === 0) {
      this.error(
        res,
        "--cliAuth/invalid-token",
        "Token given is invalid.",
        404
      );
      return;
    }

    const userInfo = await UserModel.findOne({ uId: tokenExists[0]?.userId });

    // send success response
    this.success(res, "--cliAuth/success", "Authenticated successfully", 200, {
      email: userInfo.email,
      username: userInfo?.email,
      userId: userInfo?.uId,
      token,
    });
  }
}
