import { CatchErrors } from "../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import { isCliUserLoggedIn, isLoggedIn } from "../middlewares/auth";
import dbConnect from "../config/mongodb";
import CommandController from "../controller/commands";

const cmdController = new CommandController();

const getAllCmds = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    await cmdController.getSharedCommands(req, res);
  }
};

export default isLoggedIn(CatchErrors(getAllCmds));
