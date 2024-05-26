import { useNotificationStore } from "@/store/notificationStore";

const Notification = ({ id, message }) => {
  const { removeNotification, snoozeNotification } = useNotificationStore();
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 p-4 rounded bg-orange-400 text-white flex justify-between items-center z-50 w-[90vw] md:w-[44rem]">
      <span>{message}</span>
      <div>
        <button
          className="bg-red-500 text-white font-bold py-2 md:px-4 px-2 leading-[1rem] rounded-r mx-1"
          onClick={() => removeNotification(id)}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default Notification;
