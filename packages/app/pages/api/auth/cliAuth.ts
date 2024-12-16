import { CatchErrors } from "../middlewares/error";
import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../middlewares/auth";
import dbConnect from "../config/mongodb";
import CliAuthController from "../controller/cliAuth";

const cliAuthController = new CliAuthController();

const authenticateCliApp = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await dbConnect();
  if (req.method === "POST") {
    await cliAuthController.authenticate(req, res);
  }
};

export default CatchErrors(authenticateCliApp);
