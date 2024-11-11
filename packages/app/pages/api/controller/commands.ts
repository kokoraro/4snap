import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { isEmpty } from "../../../util";
import { CommandsModel, SettingsModel, UserModel } from "../model";
import { CreateCliAndInAppCmdSchema } from "../helper/validator";

export default class CommandController extends BaseController {
  private createCliAndInAppCmd;
  constructor() {
    super();
    this.createCliAndInAppCmd = CreateCliAndInAppCmdSchema;
  }

  // web only
  async getAllInAppCommands(req: NextApiRequest, res: NextApiResponse) {
    const userId = req["userId"];

    const allCommands = await CommandsModel.find({ userId });

    this.success(
      res,
      "--allCommands/success",
      `Command saved`,
      200,
      allCommands
    );
  }

  // cli only
  async getAllCliCommands(req: NextApiRequest, res: NextApiResponse) {
    const userInfo = req["user"];

    const allCommands = await CommandsModel.find({ userId: userInfo["uId"] });

    this.success(
      res,
      "--allCommands/success",
      `Command saved`,
      200,
      allCommands
    );
  }

  async createInAppCmd(req: NextApiRequest, res: NextApiResponse) {
    const userId = req["userId"];
    const payload = req.body;
    const { error, value } = this.createCliAndInAppCmd.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--createInAppCommand/invalid-fields", msg, 400);
      return;
    }

    const cliName = payload["name"].trim().split(" ");
    const formattedName =
      cliName.length > 1
        ? cliName
            .split(" ")
            .filter((n) => (n === " " ? n.replace(/\s/g, "") : n))
            .join(" ")
            .replace(/\s/g, "-")
        : cliName.join("");
    const cmds = payload["command"];
    const isPublic = payload["public"] ?? true;

    const nameExists = await CommandsModel.findOne({ name: cliName });

    if (!isEmpty(nameExists)) {
      this.error(
        res,
        "--createInAppCommand/name-exists",
        `Command with this name '${cliName}' already exists.`,
        400
      );
      return;
    }

    const collection = {
      userId,
      name: formattedName,
      command: cmds,
      public: isPublic,
    };

    await CommandsModel.create(collection);

    this.success(
      res,
      "--createInAppCommand/success",
      `Command saved`,
      200,
      collection
    );
  }

  async createCliCmd(req: NextApiRequest, res: NextApiResponse) {
    const userInfo = req["user"];
    const payload = req.body;
    const { error, value } = this.createCliAndInAppCmd.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--createCliCommand/invalid-fields", msg, 400);
      return;
    }

    const cliName = payload["name"].trim().split(" ");
    const formattedName =
      cliName.length > 1
        ? cliName
            .split(" ")
            .filter((n) => (n === " " ? n.replace(/\s/g, "") : n))
            .join(" ")
            .replace(/\s/g, "-")
        : cliName.join("");
    const cmds = payload["command"];
    const isPublic = payload["public"] ?? true;

    const nameExists = await CommandsModel.findOne({ name: cliName });

    if (!isEmpty(nameExists)) {
      this.error(
        res,
        "--createCliCommand/name-exists",
        `Command with this name '${cliName}' already exists.`,
        400
      );
      return;
    }

    const collection = {
      userId: userInfo?.uId,
      name: formattedName,
      command: cmds,
      public: isPublic,
    };

    await CommandsModel.create(collection);

    this.success(
      res,
      "--createCliCommand/success",
      `Command saved`,
      200,
      collection
    );
  }
}
