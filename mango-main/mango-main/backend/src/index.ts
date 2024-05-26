import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import connectDB from "./db/connect";
import errorHandler from "./middleware/errorHandler";
import authenticate from "./middleware/authentication";

import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { profitRouter } from "./routes/profit";
import { regionRouter } from "./routes/region";
import { scheduleRouter } from "./routes/schedule";

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

//register api endpoint
app.get("/hello", async (req: Request, res: Response, next: NextFunction) => {
  res.send("hi");
}); // to see if server is working, useful for production

app.use("/api", authRouter);
app.use("/api", authenticate, userRouter, profitRouter, regionRouter, scheduleRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
  }
  app.listen(port, (): void => {
    if (typeof port === "undefined")
      throw new Error("Your server is not connected");
    console.info("Server is listening on port ::", port);
  });
};
start();
