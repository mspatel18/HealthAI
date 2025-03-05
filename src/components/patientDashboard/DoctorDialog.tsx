import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Award,
  Briefcase,
  Building,
  Check,
  ChevronRight,
  DollarSign,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DoctorAvailableTime from "./DoctorAvailableTime";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import DoctorAvailableTimee from "./DoctorAvailableTime";
import { toast } from "sonner";
import { DoctorPersonalInfo } from "@/interface/doctor/personalInfo";
import { NavLink } from "react-router";
// const doctor = {
//   name: "Dr. John Doe",
//   specialty: "Cardiology",
// };
interface DoctorInterface {
  id: number;
  name: string;
  specialization: string;
  consultation_fees: number;
  experience: number;
  profile_photo: string;
  degree: string;
}
interface HealthIssuesInterface {
  id: number;
  diagnosis: string;
}
export const DoctorDialog = ({ doctor }: { doctor: DoctorInterface }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [healthIssues, setHealthIssues] = useState<HealthIssuesInterface[]>();
  const [doctorDetails, setDoctorDetails] =
    useState<Partial<DoctorPersonalInfo>>();
  const handleTimeSlotSelection = (selectedSlot: string) => {
    console.log(selectedTimeSlot);

    setSelectedTimeSlot(selectedSlot);
  };
  const [selectedHealthIssue, setSelectedHealthIssue] = useState(0);
  const handleBookAppointment = async () => {
    if (!selectedTimeSlot) {
      toast("Please select an appointment time.");
      return;
    }
    const appointmentData = {
      doctor_id: doctor.id,
      health_issues_id: selectedHealthIssue, // Replace with actual selected health issue ID
      appointment_date: selectedTimeSlot,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/setAppointment`,
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // console.log(response);

      if (response.status === 201) {
        toast.success("Appointment booked successfully!");
        setOpen(false);
      } else {
        alert("Failed to book the appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // useEffect(() => {
  const fetchDoctorDetails = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/getAllInfoDoctors`,
        { doctor_id: doctor.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const healthIssueResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/patient/getPatientHealthIssues`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(healthIssueResponse);

      if (healthIssueResponse.status === 200) {
        setHealthIssues(healthIssueResponse.data.data);
      }
      // console.log(response);
      if (response.status === 200) setDoctorDetails(response.data);
    } catch (error) {
      toast.error(String(error));
    }
  };
  // fetchDoctorDetails();
  // }, [doctor_id, token]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded font-normal"
          onClick={fetchDoctorDetails}
        >
          Book Appointment <ChevronRight strokeWidth={3} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary flex h-11/12 w-11/12 max-w-5xl flex-col justify-start gap-6 overflow-y-scroll md:h-11/12 md:flex-row lg:w-4xl">
        <DialogHeader className="flex shrink-0 flex-col items-center justify-center gap-4 p-4">
          <img
            src={doctor.profile_photo}
            alt={doctor.name}
            className="aspect-square w-24 rounded-full object-cover"
          />
          <div className="flex flex-col items-center justify-evenly">
            <DialogTitle className="text-2xl font-medium">
              {doctor.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground flex max-w-64 flex-col text-center">
              <span>{doctor.specialization}</span>
              <span>{doctor.degree}</span>
            </DialogDescription>
          </div>
          <div className="flex w-full shrink flex-col gap-2 md:w-3xs">
            <div className="bg-background flex w-full justify-between gap-4 rounded p-3 shadow">
              <div className="flex items-center justify-center gap-2">
                <div className="bg-secondary rounded-full p-2">
                  <Briefcase />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Total Experience
                  </p>
                  <p className="text-lg font-semibold">
                    {doctor.experience} years
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-background flex items-center justify-start gap-2 rounded p-3 shadow">
              <div className="bg-secondary aspect-square rounded-full p-2">
                <DollarSign />
              </div>

              <div className="">
                <p className="text-lg font-semibold">
                  {doctor.consultation_fees}
                </p>
                <p className="text-muted-foreground">Consultation</p>
              </div>
            </div>
          </div>
        </DialogHeader>
        <Tabs defaultValue="appointment">
          <TabsList className="mb-6 grid grid-cols-2">
            <TabsTrigger value="appointment" className="cursor-pointer">
              Book Appointment
            </TabsTrigger>
            <TabsTrigger value="details" className="cursor-pointer">
              Doctor Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="appointment">
            <div className="flex flex-col items-stretch gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Select Date</p>
                <DoctorAvailableTimee
                  id={doctor.id}
                  onTimeSlotSelect={handleTimeSlotSelection}
                  role="patient"
                />
                <div>
                  {/* <p className="text-muted-foreground">Select Issue</p> */}
                  {/* <Button variant="outline">Temp</Button> */}
                  <Select
                    onValueChange={(value) =>
                      setSelectedHealthIssue(parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthIssues &&
                        healthIssues.map((issue) => (
                          <SelectItem
                            value={issue.id.toString()}
                            key={issue.id}
                            className="capitalize"
                          >
                            {issue.diagnosis}
                          </SelectItem>
                        ))}
                      <NavLink to="/patient/">
                        <Button variant="ghost">
                          <Plus /> Add new Issue
                        </Button>
                      </NavLink>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-1 overflow-hidden">
                  <motion.div
                    className="w-full"
                    layout
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => setConfirmed(!confirmed)}
                    >
                      Book Appointment
                    </Button>
                  </motion.div>

                  {confirmed && (
                    <motion.div
                      initial={{ x: 50 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Button size="lg" onClick={() => handleBookAppointment()}>
                        <Check />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details">
            <div className="flex w-full flex-col items-stretch gap-4">
              <h3 className="mb-3 w-full text-lg font-medium">
                Professional Information
              </h3>
              <div className="grid w-full grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p>{doctorDetails?.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Current Hospital/Clinic
                  </p>
                  <p>{doctorDetails?.current_hospital_clinic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Methods</p>
                  <p className="capitalize">
                    {doctorDetails?.payment_methods_accepted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Languages Spoken</p>
                  <p>{doctorDetails?.languages_spoken}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-medium">
                Experience & Education
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Building className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Previous Workplaces</p>
                    <p className="text-gray-600">
                      {doctorDetails?.previous_workplaces}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="mt-0.5 mr-2 h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Internship & Residency</p>
                    <p className="text-gray-600">
                      {doctorDetails?.internship_residency_details}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-3 text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>{doctorDetails?.date_of_birth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="capitalize">{doctorDetails?.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p>{doctorDetails?.nationality}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
