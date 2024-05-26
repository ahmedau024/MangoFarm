// @ts-nocheck
"use client";
import Confirmation from "@/components/Confirmation";
import AddRegionButton from "@/components/AddRegionButton";
import Container from "@/components/Container";
import authorizedRequest from "@/lib/axios/axios";
import { capitalizeWords, displayableDateTime } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

function IrrigationAndFertilizer() {
  const [confirmationProps, setConfirmationProps] = useState({
    show: false,
    onCancel: () => {},
    onConfirm: () => {},
  });
  const [regions, setRegions] = useState([]);
  const [refresh, setRefresh] = useState(true);
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
  const [regionEdit, setRegionEdit] = useState(null);
  const router = useRouter();
  const refreshPage = () => setRefresh(!refresh);
  useEffect(() => {
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
  }, [refresh]);

  return (
    <Container>
      <Toaster richColors />
      <Confirmation confirmationProps={confirmationProps} />
      <h1 className="text-2xl font-bold md:mb-4">Irrigation And Fertilizer</h1>
      <input
        type="text"
        placeholder="Search by region name"
        className="w-full p-2 my-2 bg-slate-100  border border-slate-300 rounded"
        value={searchTerm}
        onChange={handleSearch}
      />
      {regions.length > 0 &&
        regions.map(
          (
            {
              regionId,
              numberOfTrees,
              averageMangoPerTree,
              regionName,
              irrigationData,
              fertilizerData,
            },
            index
          ) => (
            <div key={index} className="md:my-8 my-4">
              <div className="flex gap-2 items-center">
                {regionEdit[regionId] && (
                  <AddRegionButton
                    initialState={true}
                    id={regionId}
                    name={regionName}
                    numberOfTrees={numberOfTrees}
                    averageMangoPerTree={averageMangoPerTree}
                    onFormSubmit={refreshPage}
                    onCancel={() => {
                      setRegionEdit((prev) => ({
                        ...prev,
                        [regionId]: false,
                      }));
                    }}
                  />
                )}
                {!regionEdit[regionId] && (
                  <>
                    <h2 className="text-lg font-semibold mr-8 flex-1">
                      {regionName}
                    </h2>
                    <button
                      onClick={() => {
                        setRegionEdit((prev) => ({
                          ...prev,
                          [regionId]: true,
                        }));
                      }}
                    >
                      <Edit className="text-green-500" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationProps({
                          show: true,
                          onConfirm: () => {
                            authorizedRequest
                              .delete(`/api/region/${regionId}`)
                              .then(() => {
                                toast.success("Region deleted successfully");
                                setRefresh(!refresh);
                              })
                              .catch((e) =>
                                toast.error("Error deleting region.")
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
                      <Trash2 className="text-red-500" />
                    </button>
                  </>
                )}
              </div>
              <div
                className="flex gap-2 flex-col md:flex-row items-start md:justify-between md:items-center"
                key={regionId}
              >
                <div className="flex flex-col">
                  <div className="flex items-start gap-2">
                    <h2 className="font-semibold">Number of trees:</h2>
                    <p>{numberOfTrees}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">
                      Average number of mangoes per tree:
                    </h2>
                    <p>{averageMangoPerTree}</p>
                  </div>
                </div>
                <div className="flex gap-4 ">
                  <button
                    className="bg-orange-600 text-white p-2 rounded-md"
                    onClick={() =>
                      router.push(
                        `/owner/irrigation-and-fertilizer/add-irrigation?regionId=${regionId}&regionName=${regionName}`
                      )
                    }
                  >
                    Add Irrigation
                  </button>
                  <button
                    className="bg-yellow-600 text-white p-2 rounded-md"
                    onClick={() =>
                      router.push(
                        `/owner/irrigation-and-fertilizer/add-fertilizer?regionId=${regionId}&regionName=${regionName}`
                      )
                    }
                  >
                    Add Fertilizer
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-bold my-4">Irrigation</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border-b border border-gray-400 border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        DateTime
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Water Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Area Irrigated
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Weather
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Edit
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {irrigationData?.length > 0 &&
                      irrigationData.map(
                        ({
                          _id: irrigationId,
                          irrigationDateTime,
                          irrigationMethod,
                          waterUsed,
                          waterUsedUnit,
                          areaIrrigated,
                          areaIrrigatedUnit,
                          irrigationDuration,
                          irrigationDurationUnit,
                          weather = "",
                        }) => (
                          <tr key={irrigationId}>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {displayableDateTime(irrigationDateTime)}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {capitalizeWords(irrigationMethod)}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {waterUsed} {waterUsedUnit}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {areaIrrigated} {areaIrrigatedUnit}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {irrigationDuration} {irrigationDurationUnit}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {weather}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/owner/irrigation-and-fertilizer/edit-irrigation?regionId=${regionId}&regionName=${regionName}&id=${irrigationId}`
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
                                          `/api/region/${regionId}/i/${irrigationId}`
                                        )
                                        .then(() => {
                                          toast.success(
                                            "Irrigation removed successfully."
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
              <h3 className="text-sm font-bold my-4">Fertilizer</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border-b border border-gray-400 mb-16">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        DateTime
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Fertilizer Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Area Fertilized
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Edit
                      </th>
                      <th className="px-6 py-3 text-left text-xs border border-gray-400 font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fertilizerData?.length > 0 &&
                      fertilizerData.map(
                        ({
                          _id: fertilizerId,
                          fertilizerDateTime,
                          fertilizerUsed,
                          areaFertilized,
                          areaFertilizedUnit,
                        }) => (
                          <tr key={fertilizerId}>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {displayableDateTime(fertilizerDateTime)}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {fertilizerUsed} kilograms
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              {areaFertilized} {areaFertilizedUnit}
                            </td>
                            <td className="px-6 py-4 border border-gray-400 whitespace-nowrap">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/owner/irrigation-and-fertilizer/edit-fertilizer?regionId=${regionId}&regionName=${regionName}&id=${fertilizerId}`
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
                                          `/api/region/${regionId}/f/${fertilizerId}`
                                        )
                                        .then(() => {
                                          toast.success(
                                            "Fertilizer removed successfully."
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
      <AddRegionButton onFormSubmit={refreshPage} />
    </Container>
  );
}
export default IrrigationAndFertilizer;
