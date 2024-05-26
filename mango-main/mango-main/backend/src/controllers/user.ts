import { Request, Response } from "express";
import Owner from "../models/owner";
import Employee from "../models/employee";

interface EMP {
  name: string;
  email: string;
  hourlyRate: string;
  hourlyWorked: string;
  wages: number;
  timeStamp: Date;
  joinDate: string;
  leaveDate: string;
}

//Owner Controllers
const getOwner = async (req: Request, res: Response) => {
  try {
    const id: String = req.user?.userID || "";
    const found = await Owner.findById(id);
    if (found) {
      res.status(200).json({ success: true, data: found });
    } else {
      res.status(404).json({ success: false, msg: "not found" });
    }
  } catch (e) {
    console.log(e);
  }
};

const modifyOwner = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(404).json({ success: false, msg: "not found" });
      return;
    }
    const id: String = req.user.userID;
    const owner = await Owner.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.status(201).json({ success: true, data: owner });
  } catch (e) {
    console.log(e);
  }
};

const getAllOwners = async (req: Request, res: Response) => {
  try {
    const found = await Owner.find();
    if (found) {
      res.status(200).json({ success: true, data: found });
    } else {
      res.status(404).json({ success: false, msg: "not found" });
    }
  } catch (e) {
    console.log(e);
  }
};

//Employee Controllers
const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      hourlyRate,
      hourlyWorked,
      timeStamp,
      joinDate,
      leaveDate,
    }: EMP = req.body;
    const wages = Number(hourlyRate) * Number(hourlyWorked);
    const employee = await Employee.create({
      name,
      email,
      hourlyRate,
      hourlyWorked,
      wages,
      timeStamp,
      joinDate,
      leaveDate,
      owner: req.user?.userID,
    });

    if (employee?._id) {
      await Owner.findByIdAndUpdate(
        req.user?.userID,
        { $push: { employees: employee._id } },
        { new: true }
      );
      res.status(201).json({ success: true, data: employee });
    } else {
      res.status(400).json({ success: false, msg: "couldn't create employee" });
    }
  } catch (e) {
    console.log(e);
  }
};
const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const found = await Employee.find({ owner: req.user?.userID });
    if (found) {
      res.status(200).json({ success: true, data: found });
    } else {
      res.status(200).json({ success: true, data: found });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ success: false, data: "not found" });
  }
};
const getEmployee = async (req: Request, res: Response) => {
  try {
    const id: String = req.params.id;
    const found = await Employee.findById(id);
    if (found) {
      res.status(200).json({ success: true, data: found });
    } else {
      res.status(404).json({ success: false, msg: "not found" });
    }
  } catch (e) {
    console.log(e);
  }
};
const modifyEmployee = async (req: Request, res: Response) => {
  try {
    const id: String = req.params.id;
    const { hourlyRate, hourlyWorked } = req.body;
    const wages = Number(hourlyRate) * Number(hourlyWorked);
    console.log(req.body);
    const emp = await Employee.findById(id);
    if (emp?._id) {
      console.log(id);
      if (emp?.owner === req.user?.userID) {
        const employee = await Employee.findByIdAndUpdate(
          id,
          { ...req.body, wages },
          { new: true }
        );
        res.status(201).json({ success: true, data: employee });
      } else {
        res
          .status(400)
          .json({ success: false, msg: "couldn't modify employee" });
      }
    } else {
      res.status(404).json({ success: false, msg: "no employee found" });
    }
  } catch (e) {
    console.log(e);
  }
};
const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id: String = req.params.id;
    const emp = await Employee.findById(id);
    if (emp?.owner === req.user?.userID) {
      const employee = await Employee.findByIdAndDelete(id);
      if (employee?._id) {
        res.status(201).json({ success: true, data: employee });
      } else {
        res
          .status(400)
          .json({ success: false, msg: "couldn't delete employee" });
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export {
  getOwner,
  getAllOwners,
  getEmployee,
  modifyOwner,
  createEmployee,
  getAllEmployees,
  modifyEmployee,
  deleteEmployee,
};
