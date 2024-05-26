//@ts-nocheck
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
import { useEffect, useState } from "react";
export const validationSchema = z.object({
  regionId: z.string(),
  fertilizerDateTime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
      message: "Fertilizer date and time is required",
    })
    .refine((value) => value <= systemISOString(), {
      message: "Fertilizer date and time cannot be in the future",
    }),
  fertilizerUsed: z.number().min(1, { message: "Fertilizer used is required" }),
  areaFertilized: z.number().min(1, { message: "Area fertilized is required" }),
  areaFertilizedUnit: z.enum(["hectares", "acres"], {
    message: "Invalid unit",
  }),
});
export type AddValidationSchema = z.infer<typeof validationSchema>;

const EditFertilizer = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const searchParmas = useSearchParams();
  const regionId = searchParmas?.get("regionId");
  const regionName = searchParmas?.get("regionName");
  const id = searchParmas?.get("id");
  useEffect(() => {
    authorizedRequest
      .get(`/api/region/${regionId}/f/${id}`)
      .then((res) => setData(res.data.data))
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    setValue("fertilizerDateTime", data.fertilizerDateTime);
    setValue("fertilizerUsed", data.fertilizerUsed);
    setValue("areaFertilized", data.areaFertilized);
    setValue("areaFertilizedUnit", data.areaFertilizedUnit);
  }, [data]);
  const onSubmit: SubmitHandler<AddValidationSchema> = (data) => {
    authorizedRequest
      .patch(`api/fertilizer/${id}`, { ...data, regionName })
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
              <p className="text-sm text-gray-600">Fertilized Regions</p>
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
              <p className="text-sm text-gray-600">Fertilizer date and time</p>
              <input
                {...register("fertilizerDateTime")}
                className="p-2 mb-2 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="datetime-local"
                placeholder="Enter fertilizer date and time"
              />
              {errors.fertilizerDateTime && (
                <p className="text-sm text-red-500">
                  {errors.fertilizerDateTime.message}
                </p>
              )}

              <div className="bg-white flex gap-2 items-center mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600">
                <input
                  {...register("fertilizerUsed", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="p-2 "
                  type="text"
                  placeholder="Enter amount of fertilizer"
                />
                <select className="bg-white text-sm">
                  <option value="kilograms">kilograms</option>
                </select>
              </div>
              <div className="bg-white flex gap-2 items-center mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600">
                <input
                  {...register("areaFertilized", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className="p-2 "
                  type="text"
                  placeholder="Enter area fertilized"
                />
                <select
                  {...register("areaFertilizedUnit", { required: true })}
                  className="bg-white text-sm"
                >
                  <option value="hectares">hectares</option>
                  <option value="acres">acres</option>
                </select>
              </div>
              {errors.areaFertilized && (
                <p className="text-sm text-red-500">
                  {errors.areaFertilized.message}
                </p>
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
export default EditFertilizer;
