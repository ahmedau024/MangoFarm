import { Router } from "express";
const userRouter = Router();
import {
  getOwner,
  getAllOwners,
  createEmployee,
  getAllEmployees,
  modifyEmployee,
  deleteEmployee,
  getEmployee,
  modifyOwner,
} from "../controllers/user";

userRouter.route("/profile").get(getOwner).patch(modifyOwner);
userRouter.route("/employees/all").get(getAllEmployees);
userRouter.route("/employees").post(createEmployee);
userRouter
  .route("/employees/:id")
  .get(getEmployee)
  .patch(modifyEmployee)
  .delete(deleteEmployee);

export { userRouter };
