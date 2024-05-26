"use client";
import React, { useEffect, useState } from "react";
import PageTransition from "@/components/PageTransition";
import { Toaster, toast } from "sonner";
import authorizedRequest from "@/lib/axios/axios";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

const Profile = () => {
  const [userdata, setUserdata] = useState([]);
  const [tel, setTel] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    authorizedRequest
      .get(`api/profile`)
      .then((response) => {
        setUserdata(response.data.data);
      })
      .catch((error) => toast.error(error.message));
  }, [refresh]);

  return (
    <>
      <PageTransition>
        <Toaster richColors />
        <div className=" inset-0 z-50 overflow-auto flex justify-center items-center">
          <div className=" bg-slate-200 rounded-sm px-12 max-w-md mx-auto shadow-lg">
            <h1 className="px-10 pt-10 text-2xl">Profile</h1>
            {userdata && (
              <div className="flex flex-col gap-4 p-8">
                {(userdata as any).username && (
                  <h1>
                    <span className="font-bold mr-2">Username:</span>
                    {(userdata as any).username}
                    <span
                      className="opacity-50 text-sm ml-8 underline hover:opacity-100 cursor-pointer"
                      onClick={() =>
                        setUserdata((prevData) => ({
                          ...prevData,
                          username: null,
                        }))
                      }
                    >
                      Edit
                    </span>
                  </h1>
                )}
                {!(userdata as any).username && (
                  <div className="flex gap-2 items-center">
                    <span className="font-bold mr-2">Username:</span>
                    <input
                      className="w-36 px-2 py-1 border rounded-md"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      type="text"
                    />
                    <button
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700"
                      onClick={() => {
                        authorizedRequest
                          .patch("/api/profile", {
                            username,
                          })
                          .then(() => {
                            toast.success("Username added successfully.");
                            setRefresh(!refresh);
                          });
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
                <h1>
                  <span className="font-bold mr-2">Email:</span>
                  {(userdata as any).email}
                </h1>
                {(userdata as any).tel && (
                  <h1>
                    <span className="font-bold mr-2">Phone:</span>
                    {(userdata as any).tel}{" "}
                    <span
                      className="opacity-50 text-sm ml-8 underline hover:opacity-100 cursor-pointer"
                      onClick={() =>
                        setUserdata((prevData) => ({ ...prevData, tel: null }))
                      }
                    >
                      Edit
                    </span>
                  </h1>
                )}
                {(userdata as any).address && (
                  <h1>
                    <span className="font-bold mr-2">Address:</span>
                    {(userdata as any).address}{" "}
                    <span
                      className="opacity-50 text-sm ml-4 underline hover:opacity-100 cursor-pointer"
                      onClick={() =>
                        setUserdata((prevData) => ({
                          ...prevData,
                          address: null,
                        }))
                      }
                    >
                      Edit
                    </span>
                  </h1>
                )}
                {!(userdata as any).tel && (
                  <div className="flex gap-2 items-center">
                    <span className="font-bold mr-2">Phone:</span>
                    <input
                      className="w-36 px-2 py-1 border rounded-md"
                      onChange={(e) => setTel(e.target.value)}
                      value={tel}
                      type="number"
                    />
                    <button
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700"
                      onClick={() => {
                        authorizedRequest
                          .patch("/api/profile", {
                            tel,
                          })
                          .then(() => {
                            toast.success("Phone added successfully.");
                            setRefresh(!refresh);
                          });
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
                {!(userdata as any).address && (
                  <div className="flex gap-2 items-center">
                    <span className="font-bold mr-2">Address:</span>
                    <input
                      className="w-36 px-2 py-1 border rounded-md"
                      onChange={(e) => setAddress(e.target.value)}
                      value={address}
                      type="text"
                    />
                    <button
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700"
                      onClick={() => {
                        authorizedRequest
                          .patch("/api/profile", {
                            address,
                          })
                          .then(() => {
                            toast.success("Address added successfully.");
                            setRefresh(!refresh);
                          });
                      }}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Profile;
