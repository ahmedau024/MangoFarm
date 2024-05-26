// @ts-nocheck
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import Container from "@/components/Container";
import { useEffect, useState } from "react";
import authorizedRequest from "@/lib/axios/axios";
import { calculateUsage } from "@/lib/utils";
import ProfitTable from "@/components/ProfitTable";

const schema = z.object({
  averageYield: z.number().positive(),
  pricePerKg: z.number().positive(),
  waterCostPerLiter: z.number().positive(),
  fertilizerCostPerKg: z.number().positive(),
  laborCost: z.number().positive(),
  pestControlCost: z.number().positive(),
  otherOperationalCost: z.number().positive(),
  waterUsage: z.number().positive(),
  fertilizerUsage: z.number().positive(),
});

const Profit = () => {
  const [usage, setUsage] = useState([]);
  const [profit, setProfit] = useState(null);
  const [farmYield, setFarmYield] = useState(0);
  useEffect(() => {
    authorizedRequest
      .get(`api/region`)
      .then((response) => {
        return setUsage(
          calculateUsage(
            response.data.data.map((region) => ({
              ...region,
              regionId: region._id,
            }))
          )
        );
      })
      .catch((error) => toast.error(error.message));
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    let temp = 0;
    usage.forEach(({ averageRegionalYield }) => {
      temp += averageRegionalYield;
    });
    setFarmYield(temp);
    setValue("averageYield", temp / usage.length);
  }, [usage]);

  const onSubmit = (data) => {
    const {
      averageYield,
      pricePerKg,
      waterCostPerLiter,
      fertilizerCostPerKg,
      laborCost,
      pestControlCost,
      otherOperationalCost,
      waterUsage,
      fertilizerUsage,
    } = data;
    const totalRevenue = averageYield * pricePerKg;
    const totalWaterCost = waterUsage * waterCostPerLiter;
    const totalFertilizerCost = fertilizerUsage * fertilizerCostPerKg;
    const totalCosts =
      laborCost +
      pestControlCost +
      otherOperationalCost +
      totalWaterCost +
      totalFertilizerCost;
    setProfit({
      totalRevenue,
      totalCosts,
    });
  };
  return (
    <Container>
      <Toaster richColors />
      <div className="flex flex-col lg:flex-row items-start gap-16 mt-8 justify-center overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden justify-center">
          <h1 className="text-lg font-bold my-8">Regions Data</h1>
          <div className="overflow-x-auto w-[90vw] md:max-w-[90vw] lg:max-w-[50vw]">
            <table className="divide-y divide-gray-200 w-[20vw] border-b border-gray-400">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fertilizer Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Regional Yield
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usage.length > 0 &&
                  usage.map(
                    ({
                      regionName,
                      averageRegionalYield,
                      totalWaterUsedLiters,
                      totalWaterUsedGallons,
                      totalFertilizerUsed,
                    }) => (
                      <tr key={regionName}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {regionName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {`${totalWaterUsedLiters} liters | ${totalWaterUsedGallons} gallons`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {totalFertilizerUsed} kilograms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {averageRegionalYield} mangoes
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
          <div className="flex md:justify-between justify-evenly lg:w-full w-[80vw] mt-4 font-semibold">
            <h2>Total Farm Yield:</h2>
            <p>{farmYield}</p>
          </div>
          <div className="flex md:justify-between justify-evenly lg:w-full w-[80vw] mt-4 font-semibold">
            <h2>Average Farm Yield:</h2>
            <p>{farmYield / usage.length}</p>
          </div>
          <h1 className="text-lg font-bold my-8">Calculation</h1>
          <div className="overflow-x-auto max-w-[80vw] md:w-full">
            <table className="divide-y divide-gray-200 border-b border-gray-400">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Costs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Profit
                  </th>
                </tr>
              </thead>

              {profit && (
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${profit.totalRevenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${profit.totalCosts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${profit.totalRevenue - profit.totalCosts}
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          {!profit && (
            <p className="text-center my-8 mr-20">
              Fill the form with above data to calculate profit.
            </p>
          )}
          <div className=""></div>
          <ProfitTable />
        </div>
        <div className="md:w-96 w-[85vw] p-4 border rounded shadow-lg bg-white">
          <h2 className="text-xl font-bold mb-4">Profit Calculation</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block font-medium">Average Farm Yield</label>
              <input
                {...register("averageYield", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.averageYield && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Price per mango ($)</label>
              <input
                {...register("pricePerKg", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.pricePerKg && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">
                Water Cost per Liter/Gallon ($)
              </label>
              <input
                {...register("waterCostPerLiter", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.waterCostPerLiter && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">
                Fertilizer Cost per Kg ($)
              </label>
              <input
                {...register("fertilizerCostPerKg", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.fertilizerCostPerKg && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Labor Cost ($)</label>
              <input
                {...register("laborCost", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.laborCost && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Pest Control Cost ($)</label>
              <input
                {...register("pestControlCost", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.pestControlCost && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">
                Other Operational Costs ($)
              </label>
              <input
                {...register("otherOperationalCost", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.otherOperationalCost && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">
                Water Usage (liters/gallons)
              </label>
              <input
                {...register("waterUsage", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.waterUsage && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Fertilizer Usage (kg)</label>
              <input
                {...register("fertilizerUsage", { valueAsNumber: true })}
                type="number"
                className="w-full p-2 border rounded"
              />
              {errors.fertilizerUsage && (
                <p className="text-red-500">Invalid value.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-orange-500 text-white rounded"
            >
              Calculate
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Profit;
