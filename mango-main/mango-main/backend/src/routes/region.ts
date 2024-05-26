import { Router } from "express";
const regionRouter = Router();
import {
  deleteIrrigation,
  getAllRegion,
  createRegion,
  addIrrigation,
  modifyIrrigation,
  addFertilizer,
  deleteRegion,
  updateRegion,
  deleteFertilizer,
  modifyFertilizer,
  getIrrigation,
  getFertilizer,
} from "../controllers/region";

regionRouter.route("/region").post(createRegion).get(getAllRegion);
regionRouter.route("/irrigation").post(addIrrigation);
regionRouter.route("/irrigation/:irrigationID").patch(modifyIrrigation);
regionRouter.route("/fertilizer").post(addFertilizer);
regionRouter.route("/fertilizer/:fertilizerID").patch(modifyFertilizer);
regionRouter
  .route("/region/:regionID")
  .delete(deleteRegion)
  .patch(updateRegion);
regionRouter
  .route("/region/:regionID/i/:irrigationID")
  .get(getIrrigation)
  .delete(deleteIrrigation);
regionRouter
  .route("/region/:regionID/f/:fertilizerID")
  .get(getFertilizer)
  .delete(deleteFertilizer);

export { regionRouter };
