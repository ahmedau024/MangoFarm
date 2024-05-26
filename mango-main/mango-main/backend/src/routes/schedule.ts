import { Router } from "express";
const scheduleRouter = Router();
import {
  addFertilizerSchedule,
  addIrrigationSchedule,
  deleteFertilizerSchedule,
  deleteIrrigationSchedule,
  getFertilizerSchedule,
  getIrrigationSchedule,
  getFertilizerSchedules,
  getIrrigationSchedules,
  modifyFertilizerSchedule,
  modifyIrrigationSchedule,
} from "../controllers/schedule";

scheduleRouter
  .route("/schedule/:regionID/f")
  .post(addFertilizerSchedule)
  .get(getFertilizerSchedules);
scheduleRouter
  .route("/schedule/:regionID/f/:scheduleID")
  .patch(modifyFertilizerSchedule)
  .delete(deleteFertilizerSchedule)
  .get(getFertilizerSchedule);
scheduleRouter
  .route("/schedule/:regionID/i")
  .post(addIrrigationSchedule)
  .get(getIrrigationSchedules);
scheduleRouter
  .route("/schedule/:regionID/i/:scheduleID")
  .patch(modifyIrrigationSchedule)
  .get(getIrrigationSchedule)
  .delete(deleteIrrigationSchedule);
export { scheduleRouter };
