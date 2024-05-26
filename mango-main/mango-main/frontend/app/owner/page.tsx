// @ts-nocheck
"use client";
import "chart.js/auto";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Container from "@/components/Container";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Bar } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import { displayableTime } from "@/lib/utils";
import authorizedRequest from "@/lib/axios/axios";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const cityFormSchema = z.object({
  cityName: z.string().min(1, "City name is required"),
});

const defaultValues = {
  cityName: "",
};

const OwnerPage = () => {
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [chart, setChart] = useState(null);
  const initializeEvents = (region) => {
    const temp = [];
    region.irrigationData?.forEach((item) => {
      temp.push({
        color: "#5AB2FF",
        date: item.irrigationDateTime?.split("T")[0],
      });
    });
    region.fertilizerData?.forEach((item) => {
      temp.push({
        color: "#32A852",
        date: item.fertilizerDateTime?.split("T")[0],
      });
    });
    region.irrigationSchedule?.forEach((item) => {
      temp.push({
        color: "#FED37F",
        date: item.dateTime?.split("T")[0],
      });
    });
    region.fertilizerSchedule?.forEach((item) => {
      temp.push({
        color: "#5b32a8",
        date: item.dateTime?.split("T")[0],
      });
    });
    setEvents((prev) => {
      return prev.concat(temp);
    });
  };
  const initializeChart = (profitDataArray) => {
    setChart({
      labels: [
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
      ],
      datasets: [
        {
          label: "Profit",
          data: profitDataArray,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    });
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(cityFormSchema),
  });

  const onSubmit = (formData) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${formData.cityName}&appid=de6cb8f3a03c5206b2da4d473d2fc018&units=imperial`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(() => {
    authorizedRequest.get(`/api/region`).then((response) => {
      setEvents([]);
      response.data.data.map((region) => initializeEvents(region));
    });
    authorizedRequest.get(`/api/profit`).then((res) => {
      initializeChart(res.data.profit);
    });
  }, []);

  return (
    <Container>
      <Toaster richColors />
      <div className="flex flex-col md:flex-row gap-16">
        <div className="md:w-2/3 lg:w-1/2 flex-col md:h-fit lg:h-96 block md:sticky top-11">
          <h1 className="text-2xl font-bold my-4">Calendar</h1>
          <FullCalendar
            plugins={[dayGridPlugin]}
            events={events}
            initialView="dayGridMonth"
            aspectRatio={1}
          />
          <div className="grid grid-cols-2 gap-1 overflow-hidden mt-2 text-left">
            <div className="bg-[#5AB2FF] p-1 text-white rounded-md">
              Completed Irrigation
            </div>
            <div className="bg-[#32A852] p-1 text-white rounded-md">
              Completed Fertilization
            </div>
            <div className="bg-[#FED37F] p-1 text-white rounded-md">
              Scheduled Irrigation
            </div>
            <div className="bg-[#5b32a8] p-1 text-white rounded-md">
              Scheduled Fertilization
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 md:w-1/3">
          <h1 className="text-2xl font-bold my-4">Profits</h1>
          <div className="rounded-sm border min-h-[50vh] border-stroke bg-slate-200 px-2 pt-7 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            {chart && (
              <Bar
                data={chart}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            )}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row flex-wrap gap-3 items-center justify-between w-full px-8 py-4 my-8 bg-gray-100 border rounded-lg"
          >
            <h1 className="text-2xl font-bold">City Form</h1>

            <div className="flex items-center space-x-4">
              <label htmlFor="cityName" className="font-medium">
                City Name:
              </label>
              <Controller
                name="cityName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="px-2 py-1 max-w-[6rem] md:max-w-[10rem] lg:max-w-[20rem] border rounded-md"
                  />
                )}
              />
              {errors.cityName && (
                <p className="text-red-500 text-sm">
                  {errors.cityName.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="px-4 leading-[1rem] py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700"
            >
              Fetch Weather Data
            </button>
          </form>
          {Object.keys(data).length > 0 ? (
            <div className="my-8">
              <h1 className="font-bold text-2xl">
                <span className="mr-4">City:</span>
                {(data as any)?.name},{(data as any)?.sys.country}
              </h1>
              <div className="flex justify-between gap-4 space-x-4 mt-8">
                <div className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-lg  hover:shadow-2xl">
                  <div>
                    <span className="font-bold">Temperature:</span>{" "}
                    {(data as any)?.main.temp}°F
                  </div>
                  <div>
                    <span className="font-bold">Feels Like:</span>{" "}
                    {(data as any)?.main.feels_like}°F
                  </div>
                  <div>
                    <span className="font-bold">Max Temperature:</span>{" "}
                    {(data as any)?.main.temp_max}°F
                  </div>
                  <div>
                    <span className="font-bold">Min Temperature:</span>{" "}
                    {(data as any)?.main.temp_min}°F
                  </div>
                </div>
                <div className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-lg  hover:shadow-2xl">
                  <div className="flex flex-row">
                    <span className="flex flex-row font-bold  mr-1">
                      <svg
                        className="w-6 h-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                        />
                      </svg>
                      Sunrise:
                    </span>
                    {displayableTime((data as any)?.sys.sunrise)}
                  </div>
                  <div className="flex flex-row">
                    <span className="flex flex-row font-bold mr-1">
                      <svg
                        className="w-6 h-6 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sunset:{" "}
                    </span>
                    {displayableTime((data as any)?.sys.sunset)}
                  </div>
                </div>
                <div className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-lg  hover:shadow-2xl">
                  <div>
                    <span className="font-bold">description:</span>{" "}
                    {(data as any)?.weather[0].description}
                  </div>
                  <div>
                    <span className="font-bold">Wind Deg:</span>{" "}
                    {(data as any)?.wind.deg}°
                  </div>
                  <div>
                    <span className="font-bold">Wind Speed:</span>{" "}
                    {(data as any)?.wind.speed}km/h
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-8">
              <h1>Weather data not fetched yet.</h1>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default OwnerPage;
