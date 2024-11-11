import { CatchErrors } from "../middlewares/error";
import UserController from "../controller/user";
import { NextApiRequest, NextApiResponse } from "next";
import { isQwikUserLoggedIn, passageAuthMiddleware } from "../middlewares/auth";
import dbConnect from "../config/mongodb";

const userController = new UserController();

const getUserInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    await userController.getUserInfo(req, res);
  }
};

export default passageAuthMiddleware(CatchErrors(getUserInfo));
