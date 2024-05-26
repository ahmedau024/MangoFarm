"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export const validationSchema = z.object({
  username: z.string().min(3, { message: "Username is required" }),
});
export type LoginValidationSchema = z.infer<typeof validationSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<LoginValidationSchema> = (data) => {
    console.log(data);
  };
  return (
    <>
      <PageTransition>
        <div className=" inset-0 z-50 overflow-auto bg-slate-200 bg-opacity-50 flex justify-center items-center">
          <div className="m-64 bg-white rounded-sm  px-16 max-w-md mx-auto shadow-lg">
            <h1 className="pt-10 text-2xl">Enter Your Username</h1>
            <p></p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-4 flex flex-col items-center mt-10"
            >
              <input
                {...register("username", { required: true })}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-3 focus:border-orange-600"
                type="text"
                placeholder="Enter your Email Address"
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
              <button className="w-full mt-4 border  p-2 bg-orange-600 text-white rounded-md uppercase">
                Reset
              </button>

              <div className="mt-4 border-b border-black"></div>

              <div className="flex justify-start">
                <Link href="/login" className="text-blue1">
                  Return to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default ForgotPassword;
