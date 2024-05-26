//@ts-nocheck
import { Request, Response } from "express";
import Owner from "../models/owner";

const getProfits = async (req: Request, res: Response) => {
  try {
    let owner = await Owner.findById(req.user?.userID);
    res.json({
      success: true,
      message: "profit rate: ",
      profit: owner?.profitData,
    });
  } catch (e) {
    console.log(e);
  }
};
const uploadProfit = async (req: Request, res: Response) => {
  const ownerId = req.user?.userID;
  const { month, profit } = req.body;
  console.log(month, profit, ownerId);
  if (month < 0 || month > 11) {
    return res.status(400).send("Invalid month");
  }
  try {
    let owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).send("Owner not found");
    }
    owner.profitData[month] = profit;
    await owner.save();
    res.status(200).json(owner);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

export { getProfits, uploadProfit };
