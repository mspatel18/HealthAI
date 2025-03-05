import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TimeSlot {
  start_time: string;
  time: string;
  available: boolean;
  address: string;
}

const DoctorAvailableTime = ({
  id,
  onTimeSlotSelect,
  role,
}: {
  id: number;
  onTimeSlotSelect: (selectedSlot: string) => void;
  role: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot); // Update selected slot
    onTimeSlotSelect(slot);
  };

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSchedule = async () => {
      try {
        const formattedDate = `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1,
        ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        console.log(formattedDate);

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/${role}/getdoctors_timetable`,
          { doctor_id: id, date: formattedDate },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.status === 200) {
          const schedule = response.data.schedule;
          const formattedSlots = schedule.map(
            (slot: {
              start_time: string;
              available: boolean;
              address: string;
            }) => ({
              time: new Date(slot.start_time + "Z").toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                },
              ),
              start_time: slot.start_time,
              available: slot.available,
              address: slot.address,
            }),
          );
          setTimeSlots(formattedSlots);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [id, role, selectedDate, token]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="my-4" variant="outline">
            {selectedDate?.toDateString()}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="w-full rounded-md border shadow"
          />
        </PopoverContent>
      </Popover>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-md">
        {timeSlots.length !== 0 ? (
          timeSlots.map((slot, index) => (
            <Button
              key={index}
              variant={slot.start_time === selectedSlot ? "default" : "outline"} // Primary when selected
              onClick={() => handleSelectSlot(slot.start_time)}
              className={cn(
                "flex h-12 flex-col overflow-hidden rounded-md border p-4 text-ellipsis transition",
                slot.available
                  ? slot.start_time === selectedSlot
                    ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600" // Highlight selected slot
                    : "border-gray-200 text-gray-900 hover:border-blue-500"
                  : "text-muted-foreground cursor-not-allowed opacity-50",
              )}
              disabled={!slot.available}
            >
              <p>{slot.time}</p>
              <p className="text-xs font-normal">{slot.address}</p>
            </Button>
          ))
        ) : (
          <p className="col-span-full">No time slots available</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAvailableTime;
