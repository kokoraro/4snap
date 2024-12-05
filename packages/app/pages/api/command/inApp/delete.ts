import { CatchErrors } from "../../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../../middlewares/auth";
import dbConnect from "../../config/mongodb";
import CommandController from "../../controller/commands";

const cmdController = new CommandController();

const deleteInAppCmd = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    await cmdController.deleteInAppCommand(req, res);
  }
};

export default isLoggedIn(CatchErrors(deleteInAppCmd));
