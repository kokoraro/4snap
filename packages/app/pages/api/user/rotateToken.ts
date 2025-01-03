import { CatchErrors } from "../middlewares/error";
import UserController from "../controller/user";
import { NextApiRequest, NextApiResponse } from "next";
import { isLoggedIn } from "../middlewares/auth";
import dbConnect from "../config/mongodb";

const userController = new UserController();

const rotateAuthToken = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "GET") {
    await userController.rotateAuthToken(req, res);
  }
};

export default isLoggedIn(CatchErrors(rotateAuthToken));
