import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";

interface HolidayInterface {
  id: number;
  start_date: Date;
  end_date: Date;
}

export const SetHoliday = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [holidays, setHolidays] = useState<HolidayInterface[]>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctor/getHoliday`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.status === 200) {
          setHolidays(response.data.holidays);
        }
      } catch (error) {
        toast.error(String(error));
      }
    };
    fetchHolidays();
  }, [token]);

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:00`;
  };

  const saveHoliday = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    try {
      const formattedStartDate = formatDateTime(startDate);
      const formattedEndDate = formatDateTime(endDate);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setHoliday`,
        {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          timezone: "UTC",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 201) {
        toast.success("Holiday set successfully");
        setConfirmed(false);
      }
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="mx-auto mt-6 flex flex-col gap-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Set Holiday</h2>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <p>Start Date</p>
          <Input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <p>End Date</p>
          <Input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex w-36 gap-1 overflow-hidden">
          <motion.div
            className="w-full"
            layout
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Button className="w-full" onClick={() => setConfirmed(!confirmed)}>
              Save
            </Button>
          </motion.div>
          {confirmed && (
            <motion.div
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Button onClick={saveHoliday}>
                <Check />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Previous Holidays</p>
        {holidays && holidays.length > 0 ? (
          holidays.map((holiday) => (
            <div key={holiday.id} className="mt-2 flex flex-wrap gap-4">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p>{new Date(holiday.start_date + "Z").toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p>{new Date(holiday.end_date).toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No holidays set.</p>
        )}
      </div>
    </div>
  );
};
