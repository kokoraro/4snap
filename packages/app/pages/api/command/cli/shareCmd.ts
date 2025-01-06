import { CatchErrors } from "../../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import { isCliUserLoggedIn } from "../../middlewares/auth";
import dbConnect from "../../config/mongodb";
import CommandController from "../../controller/commands";

const cmdController = new CommandController();

const shareCmd = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    await cmdController.shareCliCmd(req, res);
  }
};

export default isCliUserLoggedIn(CatchErrors(shareCmd));
