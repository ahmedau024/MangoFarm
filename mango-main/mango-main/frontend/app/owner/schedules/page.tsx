// @ts-nocheck
"use client";
import Confirmation from "@/components/Confirmation";
import Container from "@/components/Container";
import authorizedRequest from "@/lib/axios/axios";
import { capitalizeWords, displayableDateTime } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

const Schedules = () => {
  const [regions, setRegions] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [confirmationProps, setConfirmationProps] = useState({
    show: false,
    onCancel: () => {},
    onConfirm: () => {},
  });
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === "")
      authorizedRequest
        .get(`api/region`)
        .then((response) => {
          setRegions(
            response.data.data.map((region) => ({
              ...region,
              regionId: region._id,
            }))
          );
          const temp = {};
          response.data.data.forEach((region) => (temp[region._id] = false));
          setRegionEdit(temp);
        })
        .catch((error) => toast.error(error.message));
    const filtered = regions.filter((region) =>
      region.regionName.toLowerCase().includes(term.toLowerCase())
    );
    setRegions(filtered);
  };
  const router = useRouter();

  useEffect(() => {
    authorizedRequest
      .get(`api/region`)
      .then((response) => {
        setRegions(
          response.data.data.map((region) => {
            return {
              ...region,
              regionId: region._id,
            };
          })
        );
      })
      .catch((error) => toast.error(error.message));
  }, [refresh]);

  return (
    <Container>
      <Toaster richColors />
      <Confirmation confirmationProps={confirmationProps} />
      <h1 className="text-2xl font-bold mb-12">Schedules</h1>
      <input
        type="text"
        placeholder="Search by region name"
        className="w-full p-2 my-2 bg-slate-100  border border-slate-300 rounded"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="flex-1 h-screen">
        {regions.length > 0 &&
          regions.map(
            (
              { regionId, regionName, irrigationSchedule, fertilizerSchedule },
              index
            ) => (
              <div key={index} className="my-8">
                <div
                  className="flex md:flex-row flex-col gap-1 justify-between"
                  key={regionId}
                >
                  <div className="flex gap-4 items-center">
                    <h2 className="text-lg font-semibold">{regionName}</h2>
                  </div>
                  <div className="flex gap-4 ">
                    <button
                      className="bg-orange-600 text-white p-1 md:p-2 rounded-md"
                      onClick={() =>
                        router.push(
                          `/owner/schedules/add-schedule?type=i&regionId=${regionId}&regionName=${regionName}`
                        )
                      }
                    >
                      Add Irrigation Schedule
                    </button>
                    <button
                      className="bg-yellow-600 text-white p-1 md:p-2 rounded-md"
                      onClick={() =>
                        router.push(
                          `/owner/schedules/add-schedule?type=f&regionId=${regionId}&regionName=${regionName}`
                        )
                      }
                    >
                      Add Fertilizer Schedule
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-bold my-4">Irrigation Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="border-collapse min-w-full divide-y divide-gray-200 border-b border-gray-400">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider">
                          DateTime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider">
                          Edit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {irrigationSchedule?.length > 0 &&
                        irrigationSchedule.map(
                          ({ _id: scheduleId, dateTime }) => (
                            <tr key={scheduleId}>
                              <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                                {displayableDateTime(dateTime)}
                              </td>
                              <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/owner/schedules/edit-schedule?regionId=${regionId}&regionName=${regionName}&id=${scheduleId}&type=i`
                                    )
                                  }
                                >
                                  <Edit className="text-green-600" />
                                </button>
                              </td>
                              <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    setConfirmationProps({
                                      show: true,
                                      onConfirm: () => {
                                        authorizedRequest
                                          .delete(
                                            `/api/schedule/${regionId}/i/${scheduleId}`
                                          )
                                          .then(() => {
                                            toast.success(
                                              "Schedule removed successfully."
                                            );
                                            setRefresh(!refresh);
                                          });
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
                          )
                        )}
                    </tbody>
                  </table>
                </div>
                <h3 className="text-sm font-bold my-4">Fertilizer Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border-b border-gray-400">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider">
                          DateTime
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider">
                          Edit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 border border-gray-400 uppercase tracking-wider">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fertilizerSchedule?.length > 0 &&
                        fertilizerSchedule.map(
                          ({ _id: scheduleId, dateTime }) => (
                            <tr key={scheduleId}>
                              <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                                {displayableDateTime(dateTime)}
                              </td>
                              <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/owner/schedules/edit-schedule?regionId=${regionId}&regionName=${regionName}&id=${scheduleId}&type=f`
                                    )
                                  }
                                >
                                  <Edit className="text-green-600" />
                                </button>
                              </td>
                              <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                                <button
                                  onClick={() =>
                                    setConfirmationProps({
                                      show: true,
                                      onConfirm: () => {
                                        authorizedRequest
                                          .delete(
                                            `/api/schedule/${regionId}/f/${scheduleId}`
                                          )
                                          .then(() => {
                                            toast.success(
                                              "Schedule removed successfully."
                                            );
                                            setRefresh(!refresh);
                                          });
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
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
      </div>
    </Container>
  );
};
export default Schedules;
