import mongoose, { Date } from "mongoose";

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
    _id?: string;
  }[];
  fertilizerData?: {
    fertilizerDateTime: string;
    fertilizerUsed: string;
    areaFertilized: string;
    areaFertilizedUnit: string;
    weather?: string;
    _id?: string;
  }[];
  irrigationSchedule: {
    dateTime: string;
    _id?: string;
  }[];
  fertilizerSchedule: {
    dateTime: string;
    _id?: string;
  }[];
}

let regionSchema = new mongoose.Schema<REGION>({
  owner: {
    type: String,
    required: true,
  },
  regionName: {
    type: String,
    required: true,
  },
  numberOfTrees: {
    type: String,
    required: true,
  },
  averageMangoPerTree: {
    type: String,
    required: true,
  },
  irrigationData: {
    type: [
      {
        irrigationId: { type: String, required: true },
        irrigationDateTime: { type: String, required: true },
        irrigationMethod: { type: String, required: true },
        waterUsed: { type: String, required: true },
        waterUsedUnit: { type: String, required: true },
        areaIrrigated: { type: String, required: true },
        areaIrrigatedUnit: { type: String, required: true },
        irrigationDuration: { type: String, required: true },
        irrigationDurationUnit: { type: String, required: true },
        weather: { type: String, required: false },
      },
    ],
    required: false,
  },
  fertilizerData: {
    type: [
      {
        fertilizerId: { type: String, required: true },
        fertilizerDateTime: { type: String, required: true },
        fertilizerUsed: { type: String, required: true },
        areaFertilized: { type: String, required: true },
        areaFertilizedUnit: { type: String, required: true },
      },
    ],
    required: false,
  },
  irrigationSchedule: {
    type: [
      {
        scheduleId: { type: String, required: true },
        dateTime: { type: String, required: true },
      },
    ],
    required: false,
  },
  fertilizerSchedule: {
    type: [
      {
        scheduleId: { type: String, required: true },
        dateTime: { type: String, required: true },
      },
    ],
    required: false,
  },
});

const Region = mongoose.model("region", regionSchema);
export default Region;
