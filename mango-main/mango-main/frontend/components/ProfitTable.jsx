import authorizedRequest from "@/lib/axios/axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ProfitTable = () => {
  const [profit, setProfit] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [tempProfit, setTempProfit] = useState(0);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    authorizedRequest
      .get("/api/profit")
      .then((res) => setProfit(res.data.profit));
  }, [refresh]);

  const handleEdit = (index) => {
    setEditIndex(index);
    setTempProfit(profit[index]);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleSave = (index) => {
    authorizedRequest
      .patch("/api/profit", {
        month: index,
        profit: tempProfit,
      })
      .then(() => {
        toast.success("Profit added successfully");
        setRefresh(!refresh);
      })
      .catch((e) => {
        toast.error("Error adding profit.");
      });
    setEditIndex(null);
  };

  return (
    <>
      <div className="container md:hidden mx-auto w-[100vw] ">
        <h2 className="text-lg text-center font-bold mb-4">Profit Table</h2>
        <div className="overflow-x-auto max-w-[80vw]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Month</th>
                <th className="px-4 py-2">Profits</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {profit.map((profit, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{months[index]}</td>
                  <td className="border px-4 py-2">
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={tempProfit}
                        onChange={(e) => setTempProfit(e.target.value)}
                        className="px-2 py-1 w-32"
                      />
                    ) : (
                      profit
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editIndex === index ? (
                      <>
                        <button
                          onClick={() => handleSave(index)}
                          className="bg-blue-500 hover:bg-blue-700 text-white uppercase font-bold py-1 px-2 mr-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-red-500 hover:bg-red-700 text-white uppercase font-bold py-1 px-2 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(index)}
                        className={`${
                          profit == 0
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-green-500 hover:bg-green-700"
                        } text-white font-bold uppercase py-1 px-4 rounded`}
                      >
                        {profit == 0 ? "Add" : "Edit"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="container hidden md:block mx-auto px-4 my-8">
        <h2 className="text-lg text-center font-bold mb-4">Profit Table</h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Profits</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {profit.map((profit, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{months[index]}</td>
                <td className="border px-4 py-2">
                  {editIndex === index ? (
                    <input
                      type="number"
                      value={tempProfit}
                      onChange={(e) => setTempProfit(e.target.value)}
                      className="px-2 py-1 w-32"
                    />
                  ) : (
                    profit
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editIndex === index ? (
                    <>
                      <button
                        onClick={() => handleSave(index)}
                        className="bg-blue-500 hover:bg-blue-700 text-white uppercase font-bold py-1 px-2 mr-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-700 text-white uppercase font-bold py-1 px-2 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(index)}
                      className={`${
                        profit == 0
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-green-500 hover:bg-green-700"
                      } text-white font-bold uppercase py-1 px-4 rounded`}
                    >
                      {profit == 0 ? "Add" : "Edit"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default ProfitTable;
