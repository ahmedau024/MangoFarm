"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const SellerHeaderNavBar = () => {
  const router = useRouter();
  return (
    <>
      <div className="sticky flex p-4 top-0 z-999 w-full bg-white shadow-md  dark:drop-shadow-none justify-end pb-4 pt-2">
        <div className="flex items-end space-x-4">
          <div className="flex col-flex p-4 justify-between space-x-2"></div>
        </div>
      </div>
    </>
  );
};
export default SellerHeaderNavBar;
