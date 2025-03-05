import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { SetHoliday } from "./SetHoliday";
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
  location: string;
}

type DaySchedule = {
  enabled: boolean;
  slots: TimeSlot[];
};

type WeeklySchedule = {
  [key: string]: DaySchedule;
};

export default function SetAvailability() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    Monday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
    Tuesday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
    Wednesday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
    Thursday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
    Friday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
    Saturday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
    Sunday: {
      enabled: false,
      slots: [{ start: "09:00", end: "12:00", location: "Clinic A" }],
    },
  });
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctor/getTimings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log(response.data);

        const { timings } = response.data;

        const newSchedule: WeeklySchedule = {
          Monday: { enabled: false, slots: [] },
          Tuesday: { enabled: false, slots: [] },
          Wednesday: { enabled: false, slots: [] },
          Thursday: { enabled: false, slots: [] },
          Friday: { enabled: false, slots: [] },
          Saturday: { enabled: false, slots: [] },
          Sunday: { enabled: false, slots: [] },
        };

        timings.forEach(
          ({
            day,
            start_time,
            end_time,
            address,
          }: {
            day: string;
            start_time: string;
            end_time: string;
            address: string;
          }) => {
            if (!newSchedule[day]) {
              newSchedule[day] = { enabled: false, slots: [] };
            }
            newSchedule[day].enabled = true;
            newSchedule[day].slots.push({
              start: start_time.slice(0, -3),
              end: end_time.slice(0, -3),
              location: address,
            });
          },
        );

        setSchedule(newSchedule);
      } catch (error) {
        console.error("Error fetching schedule", error);
      }
    };

    fetchSchedule();
  }, [token]);
  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const addTimeSlot = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [
          ...prev[day].slots,
          { start: "08:00", end: "12:00", location: "" },
        ],
      },
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: "start" | "end" | "location",
    value: string,
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot,
        ),
      },
    }));
  };

  const saveSchedule = async () => {
    const apiPayload = {
      timings: Object.entries(schedule)
        .filter(([, { enabled }]) => enabled)
        .flatMap(([day, { slots }]) =>
          slots.map(({ start, end, location }) => ({
            day,
            start_time: start,
            end_time: end,
            location,
          })),
        ),
    };
    console.log(apiPayload);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setTimings`,
        apiPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("Schedule saved successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving schedule");
    }
  };

  return (
    <>
      <div className="mx-auto rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Set Availability</h2>
          <Button
            onClick={saveSchedule}
            className="mt-2 w-full sm:mt-0 sm:w-auto"
          >
            Save
          </Button>
        </div>

        {/* Days List */}
        <div className="space-y-4">
          {Object.entries(schedule).map(([day, { enabled, slots }]) => (
            <div
              key={day}
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              {/* Checkbox & Day Name */}
              <div className="flex w-full items-center sm:w-24">
                <Checkbox
                  checked={enabled}
                  onCheckedChange={() => toggleDay(day)}
                  id={`day-${day}`}
                />
                <label
                  htmlFor={`day-${day}`}
                  className="ml-2 text-sm font-medium"
                >
                  {day}
                </label>
              </div>

              {/* Slots */}
              <div className="w-full flex-1">
                {!enabled ? (
                  <div className="text-sm text-gray-500">Unavailable</div>
                ) : (
                  <div className="space-y-2">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
                      >
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateTimeSlot(day, index, "start", e.target.value)
                          }
                          className="w-full rounded border px-2 py-1 text-sm sm:w-auto"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateTimeSlot(day, index, "end", e.target.value)
                          }
                          className="w-full rounded border px-2 py-1 text-sm sm:w-auto"
                        />
                        <input
                          type="text"
                          value={slot.location}
                          onChange={(e) =>
                            updateTimeSlot(
                              day,
                              index,
                              "location",
                              e.target.value,
                            )
                          }
                          placeholder="Location"
                          className="w-full flex-grow rounded border px-2 py-1 text-sm"
                        />
                        <button
                          onClick={() => removeTimeSlot(day, index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Slot Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addTimeSlot(day)}
                disabled={!enabled}
              >
                <Plus size={16} className="text-blue-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <SetHoliday />
    </>
  );
}
