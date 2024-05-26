//@ts-nocheck
"use client";
import SideNavBar from "@/components/navbar/SideNavBar";
import Notification from "@/components/Notification";
import ProtectedPage from "@/components/protected/ProtectedPage";
import { useState, useEffect } from "react";
import NextTopLoader from "nextjs-toploader";
import { toast } from "sonner";
import authorizedRequest from "@/lib/axios/axios";
import { useNotificationStore } from "@/store/notificationStore";
import { displayableDateTime } from "@/lib/utils";

const SellerPage = ({ children }: { children: React.ReactNode }) => {
  const [regions, setRegions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, addNotification } = useNotificationStore();

  console.log(notifications);

  useEffect(() => {
    authorizedRequest.get(`api/region`).then((response) => {
      setRegions(
        response.data.data.map((region) => {
          return {
            ...region,
            regionId: region._id,
          };
        })
      );
    });
  }, []);

  const populateNotifications = () =>
    regions.forEach((region) => {
      region.irrigationSchedule.forEach((schedule) => {
        console.log(new Date(schedule.dateTime), new Date());
        if (new Date(schedule.dateTime) < new Date()) {
          const message = `Irrigate ${
            region.regionName
          } at ${displayableDateTime(schedule.dateTime)}`;
          addNotification(message, new Date(schedule.dateTime));
        }
      });
      region.fertilizerSchedule.forEach((schedule) => {
        console.log(new Date(schedule.dateTime), new Date());
        if (new Date(schedule.dateTime) < new Date()) {
          const message = `Fertilize ${
            region.regionName
          } at ${displayableDateTime(schedule.dateTime)}`;
          addNotification(message, new Date(schedule.dateTime));
        }
      });
    });

  useEffect(() => {
    populateNotifications();
    const timer = setInterval(populateNotifications, 60000);
    return () => clearInterval(timer);
  }, [regions]);

  return (
    <>
      <div className="flex overflow-y-hidden">
        <SideNavBar />
        <div className="w-full overflow-y-scroll h-screen">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              id={notification.id}
              message={notification.message}
            />
          ))}
          <div className="px-5 py-10 w-full">
            <NextTopLoader color="#0078ff" height={5} />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerPage;
