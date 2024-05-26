"use client";
import { authorizationAPI } from "@/lib/axios/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface ProtectedPageProps {
  children: React.ReactNode;
}

interface checkType {
  success: boolean;
  message: string;
  kycStatus: number;
  statusCode: number;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [checkKyc, setcheckKyc] = useState<checkType | undefined>();
  const router = useRouter();

  const checkKycStatus = useMemo(
    () => async () => {
      const { data: checkKycStatus } = await authorizationAPI.get(
        "/authenticate",
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${session?.user.token}`,
          },
        }
      );
      setcheckKyc(checkKycStatus);
    },
    [session]
  );

  useEffect(() => {
    if (session) checkKycStatus();
  }, [session]);

  const queryClientSeller = new QueryClient();

  useEffect(() => {
    if (status === "unauthenticated" && !session) {
      router.push("/login"); // Redirect to login if not authenticated
    }
    if (status === "authenticated") {
      if (checkKyc?.statusCode === 1) router.push("/acc-suspended");

      if (checkKyc?.kycStatus === 4)
        router.push("/seller/kyc/uploadsuccessful");
      if (checkKyc?.kycStatus === 3) router.push("/seller/kyc/storetime");
      if (checkKyc?.kycStatus === 2) router.push("/seller/kyc/ondc");
      if (checkKyc?.kycStatus === 1) router.push("/seller/kyc/bankdetails");
      if (checkKyc?.kycStatus === null || 0) router.push("/seller/kyc");
      // if(session?.user?.statusCode === 0) router.push('/seller/kyc')
    }
  }, [session, checkKyc]);

  if (status === "loading") return <div>loading...</div>;

  if (status === "authenticated" && checkKyc?.statusCode == 0)
    return (
      <div>
        <QueryClientProvider client={queryClientSeller}>
          {children}
        </QueryClientProvider>
      </div>
    );
  return null;
};

export default ProtectedPage;
