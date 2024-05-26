import { Router } from "express";
import { getProfits, uploadProfit } from "../controllers/profit";
const profitRouter = Router();
profitRouter.route("/profit").get(getProfits).patch(uploadProfit);
export { profitRouter };
