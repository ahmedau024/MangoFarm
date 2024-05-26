import { NextFunction, Request, Response } from "express";

const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err?.stack);
  res
    .status(500)
    .json({ success: false, msg: "Internal server error, check console " });
};

export default errorHandler;
