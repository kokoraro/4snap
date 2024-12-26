import { CatchErrors } from "../../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import { isCliUserLoggedIn } from "../../middlewares/auth";
import dbConnect from "../../config/mongodb";
import CommandController from "../../controller/commands";

const cmdController = new CommandController();

const getCliCmdByName = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    await cmdController.getCliCommandByName(req, res);
  }
};

export default CatchErrors(getCliCmdByName);
