"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import authorizedRequest from "@/lib/axios/axios";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";
import { displayableDateTime, systemISOString } from "@/lib/utils";
import { useEffect, useState } from "react";

export const validationSchema = z.object({
  regionId: z.string(),
  scheduleDateTime: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, {
      message: "Schedule date and time is required",
    })
    .refine((value) => value > systemISOString(), {
      message: "Schedule date and time cannot be in the past",
    }),
});

export type AddValidationSchema = z.infer<typeof validationSchema>;

const EditSchedule = () => {
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
  const type = searchParmas?.get("type");
  const regionId = searchParmas?.get("regionId");
  const regionName = searchParmas?.get("regionName");
  const id = searchParmas?.get("id");
  useEffect(() => {
    authorizedRequest
      .get(`/api/schedule/${regionId}/${type}/${id}`)
      .then((res) => setValue("scheduleDateTime", res.data.data.dateTime))
      .catch((e) => toast.error(e));
  }, []);
  const onSubmit: SubmitHandler<AddValidationSchema> = (data) => {
    authorizedRequest
      .patch(`api/schedule/${regionId}/${type}/${id}`, {
        dateTime: data.scheduleDateTime,
        regionName,
      })
      .then(() => router.replace("/owner/schedules"))
      .catch((error) => toast.error(error.message));
  };
  return (
    <>
      <PageTransition>
        <Toaster richColors />
        <button onClick={() => router.push("/owner/schedules")}>
          <ArrowLeft />
        </button>
        <div className="inset-0 z-50 overflow-auto flex justify-center items-center">
          <div className="bg-slate-200 rounded-sm px-16 max-w-lg mx-auto shadow-lg">
            {type === "i" && (
              <h1 className="pt-10 text-2xl">Edit Irrigation Schedule</h1>
            )}
            {type === "f" && (
              <h1 className="pt-10 text-2xl">Edit Fertilizer Schedule</h1>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-4 flex gap-3 flex-col mt-10"
            >
              <p className="text-sm text-gray-600">Scheduled Region</p>
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
              <p className="text-sm text-gray-600">Schedule date and time</p>
              <input
                {...register("scheduleDateTime")}
                className="p-2 mb-2 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="datetime-local"
                placeholder="Enter date and time"
              />
              {errors.scheduleDateTime && (
                <p className="text-sm text-red-500">
                  {errors.scheduleDateTime.message}
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
export default EditSchedule;
