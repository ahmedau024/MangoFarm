"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export const validationSchema = z.object({
  email: z.string().min(3, { message: "Email is required" }),
  password: z
    .string()
    .min(5, { message: "Password must be atleast 5 characters" }),
});
export type LoginValidationSchema = z.infer<typeof validationSchema>;

const Login = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<LoginValidationSchema> = (data) => {
    axios
      .post("http://localhost:8081/api/login", data, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        const { token, data } = response.data;
        const user = {
          id: data.id,
          username: data.username,
          email: data.email,
        };
        login(user, token);
        router.push("/owner");
        toast.success("Logged In SUCCESSFULLY!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <>
      <PageTransition>
        <Toaster richColors />
        <div className=" inset-0 z-50 overflow-auto bg-slate-200 bg-opacity-50 flex justify-center h-screen items-center">
          <div className="m-48 bg-white rounded-sm  px-16 max-w-md mx-auto shadow-lg">
            <h1 className="pt-10 text-2xl">Sign In to your account</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-4 flex flex-col items-center mt-10"
            >
              <input
                {...register("email", { required: true })}
                className="p-2 mb-4 border-b-2 border-black  outline-none focus:border-b-3 focus:border-orange-600"
                type="text"
                placeholder="Enter your Email Address"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}

              <input
                {...register("password", { required: true })}
                className="p-2 mb-4 border-b-2 border-black outline-none focus:border-b-3 focus:border-blue-900"
                type="password"
                placeholder="Enter your Password"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <button className="w-full mt-4 border  p-2 bg-orange-600 text-white rounded-md uppercase">
                Submit
              </button>

              <div className="mt-4 border-b border-black"></div>

              <div className="text-md md:text-lg space-x-5 flex mt-4">
                <div>Create New Account?</div>
                <Link href="/register" className="text-blue1">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Login;
