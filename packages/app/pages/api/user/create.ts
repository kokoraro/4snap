import { CatchErrors } from "../middlewares/error";
import UserController from "../controller/user";
import { NextApiRequest, NextApiResponse } from "next";
import { passageAuthMiddleware } from "../middlewares/auth";
import dbConnect from "../config/mongodb";

const userController = new UserController();

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    await userController.create(req, res);
  }
};

export default passageAuthMiddleware(CatchErrors(createUser));
