import { Request, Response, NextFunction } from "express";
import Region from "../models/region";

interface REGION {
  owner: string;
  regionName: string;
  irrigationData?: {
    irrigationDateTime: string;
    irrigationMethod: string;
    waterUsed: string;
    waterUsedUnit: string;
    areaIrrigated: string;
    areaIrrigatedUnit: string;
    irrigationDuration: string;
    irrigationDurationUnit: string;
    weather?: string;
  }[];
  fertilizerData?: {
    fertilizerDateTime: string;
    fertilizerUsed: string;
    areaFertilized: string;
    areaFertilizedUnit: string;
    weather?: string;
  }[];
  irrigationSchedule?: {
    dateTime: string;
  }[];
  fertilizerSchedule?: {
    dateTime: string;
  }[];
}

const addIrrigationSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID = req.params.regionID || "";
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: {
            irrigationSchedule: { dateTime: req.body.scheduleDateTime },
          },
        },
        { new: true }
      );
      console.log(newRegion);
      res.status(200).json({ success: true, data: newRegion });
    } else {
      res.status(401).json({ success: false, msg: "cannot add irrigation" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const deleteIrrigationSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID: string = req.params.regionID;
    const scheduleID: string = req.params.scheduleID;
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { irrigationSchedule: { _id: scheduleID } },
        },
        { new: true }
      );
      console.log(newRegion);
      if (newRegion) res.status(200).json({ success: true, data: newRegion });
    } else {
      res.status(400).json({ msg: "couldn't" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const modifyIrrigationSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleID = req.params?.scheduleID || "";
    const schedule = req.body;
    const regionID = req.params?.regionID || "";
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const oldRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { irrigationSchedule: { _id: scheduleID } }, // Remove the element with the specified ID
        },
        { new: true }
      );
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: {
            irrigationSchedule: {
              _id: scheduleID, // add fertilizer again with same id, same for irrigation
              ...schedule,
            },
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: newRegion });
      return;
    } else {
      res.status(401).json({ success: false, msg: "cannot add fertilizer" });
      return;
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const modifyFertilizerSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const scheduleID = req.params?.scheduleID || "";
    const schedule = req.body;
    const regionID = req.params?.regionID || "";
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const oldRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { fertilizerSchedule: { _id: scheduleID } }, // Remove the element with the specified ID
        },
        { new: true }
      );
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: {
            fertilizerSchedule: {
              _id: scheduleID, // add fertilizer again with same id, same for irrigation
              ...schedule,
            },
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: newRegion });
      return;
    } else {
      res.status(401).json({ success: false, msg: "cannot add fertilizer" });
      return;
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const addFertilizerSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID = req.params.regionID || "";
    let region = await Region.findById(regionID);
    console.log(req.body, req.body.scheduleDateTime);
    if (region && region.owner === req.user?.userID) {
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: {
            fertilizerSchedule: { dateTime: req.body.scheduleDateTime },
          },
        },
        { new: true }
      );
      console.log(newRegion);
      res.status(200).json({ success: true, data: newRegion });
    } else {
      res.status(401).json({ success: false, msg: "cannot add irrigation" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const deleteFertilizerSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID: string = req.params.regionID;
    const scheduleID: string = req.params.scheduleID;
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { fertilizerSchedule: { _id: scheduleID } },
        },
        { new: true }
      );
      console.log(newRegion);
      if (newRegion) res.status(200).json({ success: true, data: newRegion });
    } else {
      res.status(400).json({ msg: "couldn't" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getIrrigationSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID = req.params.regionID;
    const region = await Region.findById(regionID);
    res.status(201).json({ success: true, data: region?.irrigationSchedule });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const getFertilizerSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID = req.params.regionID;
    const region = await Region.findById(regionID);
    res.status(201).json({ success: true, data: region?.fertilizerSchedule });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const getIrrigationSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const regionID = req.params.regionID;
    const scheduleID = req.params.scheduleID;
    const region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      let iSch = region?.irrigationSchedule?.find(i=>i._id?.toString()===scheduleID)
    res.status(201).json({ success: true, data: iSch });
  }else{
          res.status(400).json({ msg: "couldn't" });

  }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const getFertilizerSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
    try {
      const regionID = req.params.regionID;
      const scheduleID = req.params.scheduleID;
      const region = await Region.findById(regionID);
      console.log(region?.owner, req.user?.userID)
       if (region && region.owner === req.user?.userID) {
        let fSch = region?.fertilizerSchedule?.find(
          (i) => i._id?.toString() === scheduleID
        )
        console.log(fSch)
    res
      .status(201)
      .json({
        success: true,
        data: fSch ,
      });}
      else{
              res.status(400).json({ msg: "couldn't" });

      }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export {
  addFertilizerSchedule,
  addIrrigationSchedule,
  deleteFertilizerSchedule,
  deleteIrrigationSchedule,
  modifyFertilizerSchedule,
  modifyIrrigationSchedule,
  getIrrigationSchedules,
  getFertilizerSchedules,
  getIrrigationSchedule,
  getFertilizerSchedule,

};
