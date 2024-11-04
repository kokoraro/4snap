import { CatchErrors } from "../../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import { passageAuthMiddleware } from "../../middlewares/auth";
import dbConnect from "../../config/mongodb";
import CommandController from "../../controller/commands";

const cmdController = new CommandController();

const getInAppCmd = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    await cmdController.getAllInAppCommands(req, res);
  }
};

export default passageAuthMiddleware(CatchErrors(getInAppCmd));
