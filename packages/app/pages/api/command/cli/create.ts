import { CatchErrors } from "../../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import {
  isQwikUserLoggedIn,
  passageAuthMiddleware,
} from "../../middlewares/auth";
import dbConnect from "../../config/mongodb";
import CommandController from "../../controller/commands";

const cmdController = new CommandController();

const createCliCmd = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    await cmdController.createCliCmd(req, res);
  }
};

export default isQwikUserLoggedIn(CatchErrors(createCliCmd));
