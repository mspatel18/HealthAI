import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { Calendar, Clock } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentInterface {
  appointment_id: number;
  id: number;
  appointment_date: string;
  patient_name: string;
  diagnosis: string;
}

export const DoctorHome = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [events, setEvents] = useState<AppointmentInterface[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/doctor/getAppointments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.status === 200) {
          setEvents(response.data.appointments);
        }
      } catch (error) {
        toast.error("Error occurred");
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const currentDate = new Date();
  const upcomingAppointments = events?.filter(
    (appointment) => new Date(appointment.appointment_date + "Z") > currentDate,
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-1">
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              You have {loading ? "..." : upcomingAppointments?.length}{" "}
              appointments scheduled
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <NavLink to="/doctor/appointments">
              <Calendar className="h-4 w-4" />
              <span>View All</span>
            </NavLink>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-md" />
                  ))
              : upcomingAppointments?.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <Clock className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {appointment.patient_name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">
                            {appointment.appointment_date}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            •
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {appointment.diagnosis}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
        <CardFooter>
          <NavLink to="/doctor/set-availability" className="w-full">
            <Button variant="outline" className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Button>
          </NavLink>
        </CardFooter>
      </Card>
    </div>
  );
};
