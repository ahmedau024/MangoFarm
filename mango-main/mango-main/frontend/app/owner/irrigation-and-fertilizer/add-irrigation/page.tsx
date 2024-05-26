"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@/components/PageTransition";
import { Toaster, toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import authorizedRequest from "@/lib/axios/axios";
import { systemISOString } from "@/lib/utils";

export const validationSchema = z.object({
  regionId: z.string(),
  irrigationDateTime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
      message: "Irrigation date and time is required",
    })
    .refine((value) => value <= systemISOString(), {
      message: "Irrigation date and time cannot be in the future",
    }),
  irrigationMethod: z.enum(["dripIrrigation", "sprinkler", "floodIrrigation"], {
    message: "Invalid Choice",
  }),
  waterUsed: z.number().min(1, { message: "Valid water used is required" }),
  waterUsedUnit: z.enum(["litres", "gallons"], { message: "Invalid unit" }),
  areaIrrigated: z
    .number()
    .min(1, { message: "Valid area irrigated is required" }),
  areaIrrigatedUnit: z.enum(["hectares", "acres"], {
    message: "Invalid unit",
  }),
  irrigationDuration: z
    .number()
    .min(1, { message: "Valid irrigation duration is required" }),
  irrigationDurationUnit: z.enum(["minutes", "hours"], {
    message: "Invalid unit",
  }),
  weather: z.string().optional(),
});
export type AddValidationSchema = z.infer<typeof validationSchema>;

const AddIrrigation = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddValidationSchema>({
    defaultValues: { irrigationDateTime: systemISOString() },
    resolver: zodResolver(validationSchema),
  });
  const searchParmas = useSearchParams();
  const regionId = searchParmas?.get("regionId");
  const regionName = searchParmas?.get("regionName");
  const onSubmit: SubmitHandler<AddValidationSchema> = (data) => {
    authorizedRequest
      .post(`api/irrigation`, { ...data, regionName })
      .then(() => router.replace("/owner/irrigation-and-fertilizer"))
      .catch((error) => toast.error(error.message));
  };
  return (
    <>
      <PageTransition>
        <Toaster richColors />
        <button onClick={() => router.push("/owner/irrigation-and-fertilizer")}>
          <ArrowLeft />
        </button>
        <div className="inset-0 z-50 overflow-auto flex justify-center items-center">
          <div className="bg-slate-200 rounded-sm px-16 max-w-lg mx-auto shadow-lg">
            <h1 className="pt-10 text-2xl">Add Irrigation</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-4 flex gap-3 flex-col mt-10"
            >
              <p className="text-sm text-gray-600">Irrigated Regions</p>
              <input
                {...register("regionId")}
                type="hidden"
                value={regionId!}
              />
              <input
                className="p-2 mb-2 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                disabled
                value={regionName!}
              />
              <p className="text-sm text-gray-600">Irrigation date and time</p>
              <input
                {...register("irrigationDateTime")}
                className="p-2 mb-2 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="datetime-local"
                placeholder="Enter irrigation date and time"
              />
              {errors.irrigationDateTime && (
                <p className="text-sm text-red-500">
                  {errors.irrigationDateTime.message}
                </p>
              )}
              <p className="text-sm text-gray-600">Irrigation Method</p>
              <select
                {...register("irrigationMethod", { required: true })}
                className="p-2 mb-4 border-b-2 bg-white border-black  outline-none focus:border-b-2 focus:border-orange-600"
              >
                <option value="dripIrrigation">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="floodIrrigation">Flood Irrigation</option>
              </select>
              <div className="bg-white flex gap-2 items-center mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600">
                <input
                  {...register("waterUsed", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="p-2 "
                  type="text"
                  placeholder="Enter amount of water used"
                />
                <select
                  {...register("waterUsedUnit", { required: true })}
                  className="bg-white text-sm"
                >
                  <option value="litres">litres</option>
                  <option value="gallons">gallons</option>
                </select>
              </div>
              {errors.waterUsed && (
                <p className="text-sm text-red-500">
                  {errors.waterUsed.message}
                </p>
              )}
              <div className="bg-white flex gap-2 items-center mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600">
                <input
                  {...register("areaIrrigated", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="p-2 "
                  type="text"
                  placeholder="Enter area irrigated"
                />
                <select
                  {...register("areaIrrigatedUnit", { required: true })}
                  className="bg-white text-sm"
                >
                  <option value="hectares">hectares</option>
                  <option value="acres">acres</option>
                </select>
              </div>
              {errors.areaIrrigated && (
                <p className="text-sm text-red-500">
                  {errors.areaIrrigated.message}
                </p>
              )}
              <div className="bg-white flex gap-2 items-center mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600">
                <input
                  {...register("irrigationDuration", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="p-2 "
                  type="text"
                  placeholder="Enter irrigation duration"
                />
                <select
                  {...register("irrigationDurationUnit", {
                    required: true,
                  })}
                  className="bg-white text-sm"
                >
                  <option value="minutes">minutes</option>
                  <option value="hours">hours</option>
                </select>
              </div>
              {errors.irrigationDuration && (
                <p className="text-sm text-red-500">
                  {errors.irrigationDuration.message}
                </p>
              )}
              <input
                {...register("weather")}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter weather condition (optional)"
              />
              {errors.weather && (
                <p className="text-sm text-red-500">{errors.weather.message}</p>
              )}
              <button
                type="submit"
                className="w-full mt-4 border  p-2 bg-orange-600 text-white rounded-md uppercase"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </PageTransition>
    </>
  );
};
export default AddIrrigation;
