import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function systemISOString() {
  const currentDate = new Date();
  return (
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2) +
    "T" +
    ("0" + currentDate.getHours()).slice(-2) +
    ":" +
    ("0" + currentDate.getMinutes()).slice(-2)
  );
}

export function displayableTime(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);
  let hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const displayableTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  return displayableTime;
}

export function displayableDateTime(datetimeLocalString: string) {
  const datetime = new Date(datetimeLocalString);
  const year = datetime.getFullYear();
  const month = ("0" + (datetime.getMonth() + 1)).slice(-2);
  const day = ("0" + datetime.getDate()).slice(-2);
  let hours = datetime.getHours();
  const minutes = ("0" + datetime.getMinutes()).slice(-2);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const displayableDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  return displayableDateTime;
}

export function capitalizeWords(inputString: string) {
  const words = inputString.split(/(?=[A-Z])/);
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
}

interface IrrigationData {
  irrigationDateTime: string;
  irrigationMethod: string;
  waterUsed: string;
  waterUsedUnit: string;
  areaIrrigated: string;
  areaIrrigatedUnit: string;
  irrigationDuration: string;
  irrigationDurationUnit: string;
  weather: string;
  _id: string;
}

interface FertilizerData {
  fertilizerDateTime: string;
  fertilizerUsed: string;
  areaFertilized: string;
  areaFertilizedUnit: string;
  _id: string;
}

interface Region {
  _id: string;
  owner: string;
  regionName: string;
  numberOfTrees: string;
  averageMangoPerTree: string;
  irrigationData: IrrigationData[];
  fertilizerData: FertilizerData[];
  __v: number;
  regionId: string;
}

interface UsageSummary {
  regionName: string;
  averageRegionalYield: number;
  totalWaterUsedLiters: number;
  totalWaterUsedGallons: number;
  totalFertilizerUsed: number;
}

const LITERS_TO_GALLONS = 0.264172;
export function calculateUsage(regions: Region[]): UsageSummary[] {
  return regions.map((region) => {
    let totalWaterLiters = 0;
    region.irrigationData.forEach((item) => {
      const waterUsed = parseFloat(item.waterUsed || "0");
      if (item.waterUsedUnit.toLowerCase() === "gallons") {
        totalWaterLiters += waterUsed / LITERS_TO_GALLONS;
      } else {
        totalWaterLiters += waterUsed;
      }
    });
    const totalWaterGallons = totalWaterLiters * LITERS_TO_GALLONS;
    const totalFertilizerUsed = region.fertilizerData.reduce((total, item) => {
      return total + parseFloat(item.fertilizerUsed || "0");
    }, 0);
    return {
      regionName: region.regionName,
      averageRegionalYield:
        parseInt(region.numberOfTrees) * parseFloat(region.averageMangoPerTree),
      totalWaterUsedLiters: Math.floor(totalWaterLiters * 100) / 100,
      totalWaterUsedGallons: Math.floor(totalWaterGallons * 100) / 100,
      totalFertilizerUsed,
    };
  });
}
