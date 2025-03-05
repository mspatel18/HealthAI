import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from "./Calendar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { toast } from "sonner";

interface AppointmentInterface {
  appointment_id: number;
  patient_id: number;
  appointment_date: string;
  time_of_one_appointment: number;
  patient_name: string;
  diagnosis: string;
}

interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color: "default" | "blue" | "green" | "pink" | "purple" | null | undefined;
}

export const AppointmentCalendar = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  // const [appointments, setAppointments] = useState<AppointmentInterface[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctor/getAppointments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.status === 200) {
          const fetchedAppointments = response.data.appointments;

          const updatedEvents: CalendarEvent[] = fetchedAppointments.map(
            (appointment: AppointmentInterface): CalendarEvent => ({
              id: appointment.patient_id.toString(),
              start: new Date(appointment.appointment_date + "Z"),
              end: new Date(
                new Date(appointment.appointment_date + "Z").getTime() +
                  appointment.time_of_one_appointment * 60 * 1000,
              ), // Assume 1-hour duration
              title: `${appointment.patient_name}`,
              color: "green" as "blue",
            }),
          );

          setEvents(updatedEvents);
          if (updatedEvents.length == 0) {
            toast.warning("No appoinments");
          }
        }
      } catch (error) {
        toast.error("Error occured");
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [token]);

  // Log updated events whenever state changes
  useEffect(() => {
    console.log("Updated Events:", events);
  }, [events]);

  // useEffect(() => {
  //   // Transform appointments into calendar events
  // }, [appointments]);

  return (
    <>
      {events.length > 0 ? (
        <div className="overflow-scroll">
          <Calendar events={events}>
            <div className="flex h-dvh flex-col py-6">
              <div className="mb-6 flex flex-col items-start justify-between gap-2 px-6 sm:flex-row">
                <div>
                  <CalendarViewTrigger
                    className="aria-[current=true]:bg-accent"
                    view="day"
                  >
                    Day
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                    view="week"
                    className="aria-[current=true]:bg-accent"
                  >
                    Week
                  </CalendarViewTrigger>
                  <CalendarViewTrigger
                    view="month"
                    className="aria-[current=true]:bg-accent"
                  >
                    Month
                  </CalendarViewTrigger>
                </div>
                <div className="flex items-center gap-4">
                  <CalendarCurrentDate />

                  <CalendarPrevTrigger>
                    <ChevronLeft size={20} />
                    <span className="sr-only">Previous</span>
                  </CalendarPrevTrigger>

                  <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                  <CalendarNextTrigger>
                    <ChevronRight size={20} />
                    <span className="sr-only">Next</span>
                  </CalendarNextTrigger>
                </div>
              </div>

              <div className="relative flex-1 overflow-auto px-6">
                <CalendarDayView />
                <CalendarWeekView />
                <CalendarMonthView />
              </div>
            </div>
          </Calendar>
        </div>
      ) : (
        <p>No Appointments booked</p>
      )}
    </>
  );
};
