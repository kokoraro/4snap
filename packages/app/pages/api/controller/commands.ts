import { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./base";
import { isEmpty, isValidCliCommand } from "../../../util";
import {
  CommandsModel,
  SettingsModel,
  SharedCommandsModel,
  UserModel,
} from "../model";
import {
  CreateCliAndInAppCmdSchema,
  DeleteCliAndInAppCmdSchema,
  ShareCommandSchema,
} from "../helper/validator";

export default class CommandController extends BaseController {
  private createCliAndInAppCmd;
  private deleteCliAndInAppCmd;
  private shareCliCmdSchema;

  constructor() {
    super();
    this.createCliAndInAppCmd = CreateCliAndInAppCmdSchema;
    this.deleteCliAndInAppCmd = DeleteCliAndInAppCmdSchema;
    this.shareCliCmdSchema = ShareCommandSchema;
  }

  async getAllCommands(req: NextApiRequest, res: NextApiResponse) {
    const allCommands = await CommandsModel.find();

    const publicCmds = [];

    if (allCommands.length > 0) {
      for (const cmd of allCommands) {
        if (
          cmd.public === true &&
          !publicCmds.some((publicCmd) => publicCmd.name === cmd.name)
        ) {
          const user = await UserModel.findOne({ uId: cmd.userId }).exec();
          publicCmds.push({ ...cmd.toObject(), user });
        }
      }
    }

    this.success(
      res,
      "--allCommands/success",
      `Commands fetched`,
      200,
      publicCmds
    );
  }

  // web only
  async getAllInAppCommands(req: NextApiRequest, res: NextApiResponse) {
    const userId = req["userId"];

    const allCommands = await CommandsModel.find({ userId });

    const cmds = [];

    for (const cmd of allCommands) {
      const user = await UserModel.findOne({ uId: cmd.userId }).exec();
      cmds.push({ ...cmd.toObject(), user });
    }

    this.success(res, "--allCommands/success", `Command saved`, 200, cmds);
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
            .filter((n) => (n === " " ? n.replace(/\s/g, "") : n))
            .join(" ")
            .replace(/\s/g, "-")
        : cliName.join("");
    console.log({ formattedName });

    const cmds = payload["command"]
      .trim()
      .split(", ")
      .filter((n) => (/\s/g.test(n) ? n.replace(/\s/g, "-") : n))
      .join(",");
    const isPublic = payload["public"] ?? true;

    const nameExists = await CommandsModel.findOne({ name: formattedName });

    if (!isEmpty(nameExists)) {
      this.error(
        res,
        "--createInAppCommand/name-exists",
        `Command with this name '${formattedName}' already exists.`,
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

  async deleteInAppCommand(req: NextApiRequest, res: NextApiResponse) {
    const userId = req["userId"];
    const payload = req.body;
    const { error, value } = this.deleteCliAndInAppCmd.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--deleteCommand/invalid-fields", msg, 400);
      return;
    }

    const { id } = payload;

    if (isEmpty(id)) {
      console.log("command 'id' is missing. ");
      this.error(res, "--deleteCommand/invalid-fields", `Missing params.`, 400);
      return;
    }

    // check if command exists.
    const cmdExists = await CommandsModel.findOne({ userId });
    if (isEmpty(cmdExists)) {
      this.error(
        res,
        "--deleteCommand/name-exists",
        `Command name '${cmdExists.name}' not-found.`,
        400
      );
      return;
    }

    await CommandsModel.deleteOne({ _id: id, userId });

    this.success(
      res,
      "--deleteCommand/success",
      `${cmdExists.name} command deleted.`,
      200
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

  async getCliCommandByName(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.query;
    const cmdName = payload["cmdName"] ?? "";

    if (typeof cmdName === "undefined" || cmdName.length === 0) {
      this.error(
        res,
        "--commandByName/notfound",
        `Command name not found`,
        400
      );
      return;
    }

    const filteredCmdByName = await CommandsModel.findOne({
      name: cmdName,
      public: true,
    });

    if (filteredCmdByName === null) {
      this.error(
        res,
        "--commandByName/notfound",
        `Command name not found`,
        400
      );
      return;
    }

    this.success(
      res,
      "--commandByName/success",
      `Command fetched`,
      200,
      filteredCmdByName
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

    if (!isValidCliCommand(payload["command"])) {
      this.error(
        res,
        "--createCliCommand/invalid-fields",
        `Invalid command`,
        400
      );
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
    const cmds = payload["command"]
      .trim()
      .split(", ")
      .filter((n) => (/\s/g.test(n) ? n.replace(/\s/g, "-") : n))
      .join(",");
    const isPublic = payload["public"] ?? true;
    const description = payload["description"].trim();

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
      description,
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

  async deleteCliCommand(req: NextApiRequest, res: NextApiResponse) {
    const userId = req["user"];
    const payload = req.body;
    const { error, value } = this.deleteCliAndInAppCmd.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--deleteCommand/invalid-fields", msg, 400);
      return;
    }

    const { name } = payload;

    if (isEmpty(name)) {
      console.log("command 'name' is missing. ");
      this.error(res, "--deleteCommand/invalid-fields", `Missing params.`, 400);
      return;
    }

    // check if command exists.
    const cmdExists = await CommandsModel.findOne({ userId });
    if (isEmpty(cmdExists)) {
      this.error(
        res,
        "--deleteCommand/name-exists",
        `Command name '${name}' not-found.`,
        400
      );
      return;
    }

    await CommandsModel.deleteOne({ name, userId });

    this.success(
      res,
      "--deleteCommand/success",
      `${cmdExists.name} command deleted.`,
      200
    );
  }

  async shareCliCmd(req: NextApiRequest, res: NextApiResponse) {
    const user = req["user"];
    const payload = req.body;
    const { error, value } = this.shareCliCmdSchema.validate(payload);

    if (typeof error !== "undefined") {
      const msg = error.message;
      this.error(res, "--shareCliCmd/invalid-fields", msg, 400);
      return;
    }

    const username = payload["username"];
    const cmdName = payload["cmdName"];

    const receiver = await UserModel.findOne({ username });

    if (receiver === null) {
      this.error(
        res,
        "--shareCliCmd/user-notfound",
        `Receiver was not found`,
        404
      );
      return;
    }

    const cmdExistsBySender = await CommandsModel.findOne({
      name: cmdName,
      userId: user["uId"],
    });
    const cmdExistsByReceiver = await CommandsModel.findOne({
      name: cmdName,
      userId: receiver["uId"],
    });

    if (cmdExistsBySender === null) {
      this.error(
        res,
        "--shareCliCmd/command-notfound",
        `Command name '${cmdName}' doesn't exist`,
        404
      );
      return;
    }

    if (cmdExistsByReceiver !== null) {
      this.error(
        res,
        "--shareCliCmd/command-found",
        `Receipient already has this command`,
        400
      );
      return;
    }

    // add command list to receipient directory
    await CommandsModel.create({
      name: cmdExistsBySender?.name,
      command: cmdExistsBySender?.command,
      public: cmdExistsBySender?.public,
      userId: receiver.uId,
      description: cmdExistsBySender?.description,
    });

    await SharedCommandsModel.create({
      senderId: cmdExistsBySender?.userId,
      receiverId: receiver?.uId,
    });

    const receipientInfo = await UserModel.findOne({
      uId: receiver.uId,
    });

    this.success(
      res,
      "--shareCliCmd/success",
      `Command shared successfully to ${receipientInfo?.username} `,
      200
    );
  }

  async getSharedCommands(req: NextApiRequest, res: NextApiResponse) {
    const userId = req["userId"];

    const allCmds = await SharedCommandsModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).exec();

    const sent =
      allCmds.length === 0
        ? 0
        : allCmds.filter((c) => c.senderId === userId).length;
    const received =
      allCmds.length === 0
        ? 0
        : allCmds.filter((c) => c.receiverId === userId).length;

    const comb = {
      sent,
      received,
    };

    this.success(res, "--sharedCmd/success", `successfully fetched`, 200, comb);
  }
}
