"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTransition from "@/components/PageTransition";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import authorizedRequest from "@/lib/axios/axios";

export const validationSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  email: z.string().min(10, { message: "Email is required" }),
  hourlyRate: z.number().min(1, { message: "Hourly Rate is required" }),
  hourlyWorked: z.number().min(1, { message: "Hours Worked is required" }),
  joinDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Join date is required",
  }),
  leaveDate: z.string().optional(),
});
export type AddValidationSchema = z.infer<typeof validationSchema>;

const AddEmployee = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<AddValidationSchema> = (data) => {
    authorizedRequest
      .post("/api/employees", data)
      .then((response) => {
        router.replace("/owner/employees");
        toast.success("Employee has been SUCCESSFULLY! Added");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <>
      <PageTransition>
        <Toaster richColors />
        <button onClick={() => router.push("/owner/employees")}>
          <ArrowLeft />
        </button>
        <div className=" inset-0 z-50 overflow-auto  flex justify-center items-center">
          <div className=" bg-slate-200 rounded-sm px-16 max-w-md mx-auto shadow-lg">
            <h1 className="pt-10 text-2xl">Add Employee</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-4 flex gap-3 flex-col mt-10"
            >
              <input
                {...register("name", { required: true })}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter Employee's name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              <input
                {...register("email", { required: true })}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter Employee's email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              <p className="text-sm text-gray-600">Join date</p>
              <input
                {...register("joinDate")}
                className="p-2 mb-2 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="date"
                placeholder="Enter join date"
              />
              {errors.joinDate && (
                <p className="text-sm text-red-500">
                  {errors.joinDate.message}
                </p>
              )}
              <p className="text-sm text-gray-600">Leave date</p>
              <input
                {...register("leaveDate")}
                className="p-2 mb-2 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="date"
                placeholder="Enter leave date"
              />
              {errors.leaveDate && (
                <p className="text-sm text-red-500">
                  {errors.leaveDate.message}
                </p>
              )}
              <input
                {...register("hourlyRate", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter Hourly Rate"
              />
              {errors.hourlyRate && (
                <p className="text-sm text-red-500">
                  {errors.hourlyRate.message}
                </p>
              )}
              <input
                {...register("hourlyWorked", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-2 focus:border-orange-600"
                type="text"
                placeholder="Enter Hours Worked"
              />
              {errors.hourlyWorked && (
                <p className="text-sm text-red-500">
                  {errors.hourlyWorked.message}
                </p>
              )}
              <button className="w-full mt-4 border  p-2 bg-orange-600 text-white rounded-md uppercase">
                Add
              </button>
            </form>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default AddEmployee;
