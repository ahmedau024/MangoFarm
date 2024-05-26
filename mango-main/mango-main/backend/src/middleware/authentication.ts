import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface USER {
  username: string;
  email: string;
  userID: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: USER;
    }
  }
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: String = req.headers.authorization || "";
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new Error("Missing JWT"));
    return;
  }

  const token: string = authHeader.split(" ")[1];
  try {
    const decoded: USER = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as USER;
    const { userID, username, email } = decoded;
    req.user = { userID, username, email };
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authenticate;
