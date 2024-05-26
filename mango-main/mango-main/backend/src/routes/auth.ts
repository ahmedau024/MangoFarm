import { Router } from "express";
import { register, login } from "../controllers/auth";
const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);

export { authRouter };
