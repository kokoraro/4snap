import { CatchErrors } from "../../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import {
  isQwikUserLoggedIn,
  passageAuthMiddleware,
} from "../../middlewares/auth";
import dbConnect from "../../config/mongodb";
import CommandController from "../../controller/commands";

const cmdController = new CommandController();

const getCliCmd = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    await cmdController.getAllCliCommands(req, res);
  }
};

export default isQwikUserLoggedIn(CatchErrors(getCliCmd));
