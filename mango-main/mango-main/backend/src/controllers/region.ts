import { Request, Response, NextFunction } from "express";
import Region from "../models/region";
import Owner from "../models/owner";

interface REGION {
  owner: string;
  regionName: string;
  numberOfTrees: string;
  averageMangoPerTree: string;
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
    _id: string;
  }[];
  fertilizerData?: {
    fertilizerDateTime: string;
    fertilizerUsed: string;
    areaFertilized: string;
    areaFertilizedUnit: string;
    weather?: string;
    _id?: string;
  }[];
  irrigationSchedule?: {
    dateTime: string;
  }[];
  fertilizerSchedule?: {
    dateTime: string;
  }[];
}
interface IRRIGATION {
  regionId: string;
  regionName: string;
  employeeId: string;
  employeeName: string;
  irrigationDateTime: string;
  irrigationMethod: string;
  waterUsed: string;
  waterUsedUnit: string;
  areaIrrigated: string;
  areaIrrigatedUnit: string;
  irrigationDuration: string;
  irrigationDurationUnit: string;
  weather?: string;
  _id: string;
}
interface USER {
  username: string;
  email: string;
  userID: string;
}
const createRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const { regionName, numberOfTrees, averageMangoPerTree }: REGION = req.body;
    const userID: String = req.user?.userID || "";
    if (userID) {
      const region = await Region.create({
        owner: userID,
        regionName,
        numberOfTrees,
        averageMangoPerTree,
      });
      if (region?._id) {
        let update = await Owner.findByIdAndUpdate(
          userID,
          { $push: { regions: region._id } },
          { new: true }
        );
        res.status(201).json({ success: true, data: region });
      } else {
        res.status(400).json({ success: false, msg: "bad request" });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const getAllRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const region = await Region.find({ owner: req.user?.userID });
    res.status(201).json({ success: true, data: region });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const updateRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID: string = req.params.regionID;
    const temp = await Region.findById(regionID);
    if (temp?.owner === req.user?.userID) {
      const region = await Region.findByIdAndUpdate(
        regionID,
        { ...req.body },
        { new: true }
      );
      console.log(region);
      if (region?._id) {
        res.status(200).json({ success: true, data: region });
      }
    } else {
      res.status(400).json({ success: false, msg: "bad request" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const addIrrigation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const irrigation: IRRIGATION = req.body;
    let region = await Region.findById(irrigation.regionId);
    console.log(region);
    if (region && region.owner === req.user?.userID) {
      const { regionName, regionId, ...newIrrigation } = irrigation;
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: { irrigationData: newIrrigation },
        },
        { new: true }
      );
      res.status(200).json({ success: true, data: newRegion });
      return;
    } else {
      res.status(401).json({ success: false, msg: "cannot add irrigation" });
      return;
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const deleteIrrigation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID: string = req.params.regionID;
    const irrigationID: string = req.params.irrigationID;
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { irrigationData: { _id: irrigationID } },
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

const deleteRegion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID: string = req.params.regionID;
    const region = await Region.findById(regionID);
    if (region) {
      if (region.owner === req.user?.userID) {
        await Region.findByIdAndDelete(regionID);
        res.json({ success: true, data: region });
      } else
        res.json({
          success: false,
          msg: "cannot delete region that doesn't belong to you",
        });
    } else {
      res.json({ success: false, msg: "couldn't find" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const addFertilizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fertilizer = req.body;
    let region = await Region.findById(fertilizer.regionId);
    if (region && region.owner === req.user?.userID) {
      const { regionName, regionId, ...newFertilizer } = fertilizer;
      console.log(newFertilizer);
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: { fertilizerData: newFertilizer },
        },
        { new: true }
      );
      res.status(200).json({ success: true, data: newFertilizer });
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
const modifyIrrigation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const irrigationID = req.params?.irrigationID || "";
    const irrigation = req.body;
    let region = await Region.findById(irrigation.regionId);
    if (region && region.owner === req.user?.userID) {
      const { regionName, regionId, ...newIrrigation } = irrigation;
      const oldRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { irrigationData: { _id: irrigationID } }, // Remove the element with the specified ID
        },
        { new: true }
      );
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: {
            irrigationData: {
              _id: irrigationID,
              ...irrigation,
            },
          },
        },
        { new: true }
      );
      res.status(200).json({ success: true, data: newIrrigation });
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
const getIrrigation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("hits");
    const regionID = req.params.regionID;
    const irrigationID = req.params?.irrigationID || "";
    console.log(regionID, irrigationID);
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      let irrigation = region.irrigationData?.find((irr) => {
        return irr._id?.toString() === irrigationID;
      });
      console.log(region, irrigation);
      res.status(200).json({ success: true, data: irrigation });
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
const getFertilizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("hits");
    const regionID = req.params.regionID;
    const fertilizerID = req.params?.fertilizerID || "";
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      let fertilizer = region.fertilizerData?.find((irr) => {
        return irr._id?.toString() === fertilizerID;
      });
      res.status(200).json({ success: true, data: fertilizer });
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
const modifyFertilizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fertilizerID = req.params?.fertilizerID || "";
    const fertilizer = req.body;
    let region = await Region.findById(fertilizer.regionId);
    if (region && region.owner === req.user?.userID) {
      const { regionName, regionId, ...newFertilizer } = fertilizer;
      const oldRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { fertilizerData: { _id: fertilizerID } }, // Remove the element with the specified ID
        },
        { new: true }
      );
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $push: {
            fertilizerData: {
              _id: fertilizerID, // add fertilizer again with same id, same for irrigation
              ...fertilizer,
            },
          },
        },
        { new: true }
      );

      res.status(200).json({ success: true, data: newFertilizer });
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

const deleteFertilizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const regionID: string = req.params.regionID;
    const fertilizerID: string = req.params.fertilizerID;
    console.log(fertilizerID);
    let region = await Region.findById(regionID);
    if (region && region.owner === req.user?.userID) {
      const newRegion = await Region.findByIdAndUpdate(
        region._id,
        {
          $pull: { fertilizerData: { _id: fertilizerID } },
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

export {
  deleteIrrigation,
  createRegion,
  addIrrigation,
  modifyIrrigation,
  modifyFertilizer,
  deleteRegion,
  updateRegion,
  getAllRegion,
  addFertilizer,
  deleteFertilizer,
  getIrrigation,
  getFertilizer,
};
