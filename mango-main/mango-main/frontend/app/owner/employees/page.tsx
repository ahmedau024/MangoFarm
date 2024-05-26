"use client";
import React, { useEffect, useState } from "react";
import Confirmation from "@/components/Confirmation";
import Container from "@/components/Container";
import { Edit, Trash2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import authorizedRequest from "@/lib/axios/axios";
import { useAuthStore } from "@/store/authStore";

const Employees = () => {
  const [userdata, setUserdata] = useState([]);
  const [totalWages, setTotalWages] = useState(0);
  const router = useRouter();

  const [confirmationProps, setConfirmationProps] = useState({
    show: false,
    onCancel: () => {},
    onConfirm: () => {},
  });
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    authorizedRequest
      .get(`/api/employees/all`)
      .then((response) => {
        setUserdata(response.data.data ? response.data.data : []);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [refresh]);

  useEffect(() => {
    let temp = 0;
    userdata.forEach((user) => (temp += (user as any)?.wages));
    setTotalWages(temp);
  }, [userdata]);

  return (
    <Container>
      <Toaster richColors />
      <Confirmation confirmationProps={confirmationProps} />
      <div className="flex flex-col sm:w-auto items-center  gap-2 sm:flex-row  justify-between mt-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          className="bg-orange-600 text-white p-2 rounded-md"
          onClick={() => router.push("/owner/employees/add-employee")}
        >
          Add Employee
        </button>
      </div>
      <div className="flex md:p-10 flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="border-collapse min-w-full text-left text-sm font-light text-surface border-b border-gray-400">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Join Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Leave Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Hourly Rate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Hours Worked
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Wages
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Edit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider"
                    >
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userdata &&
                    userdata.map((user) => {
                      return (
                        <tr
                          key={(user as any)._id}
                          className="border-b border-neutral-200"
                        >
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).name}
                          </td>
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).email}
                          </td>
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).joinDate}
                          </td>
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).leaveDate}
                          </td>
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).hourlyRate}
                          </td>
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).hourlyWorked}
                          </td>
                          <td className="whitespace-nowrap border border-gray-400 px-6 py-4">
                            {(user as any).wages}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                            <button
                              onClick={() =>
                                router.push(
                                  `/owner/employees/edit-employee?id=${
                                    (user as any)._id
                                  }`
                                )
                              }
                            >
                              <Edit className="text-green-600" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                            <button
                              onClick={() =>
                                setConfirmationProps({
                                  show: true,
                                  onConfirm: () => {
                                    authorizedRequest
                                      .delete(
                                        `/api/employees/${(user as any)._id}`
                                      )
                                      .then(() => {
                                        toast.success(
                                          "Employee removed successfully."
                                        );
                                        setRefresh(!refresh);
                                      })
                                      .catch((err) =>
                                        toast.error("Error removing employee.")
                                      );
                                    setConfirmationProps({
                                      ...confirmationProps,
                                      show: false,
                                    });
                                  },
                                  onCancel: () =>
                                    setConfirmationProps({
                                      ...confirmationProps,
                                      show: false,
                                    }),
                                })
                              }
                            >
                              <Trash2 className="text-red-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="flex justify-between w-full my-8">
                <h2>Total Wages:</h2>
                <p>{totalWages}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Employees;
