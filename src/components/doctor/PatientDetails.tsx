import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FileImage, Mail, Phone } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import DoctorAvailableTimee from "../patientDashboard/DoctorAvailableTime";
import { toast } from "sonner";
interface HealthIssue {
  report_pdf: string;
  id: number;
  diagnosis: string;
  symptoms: string;
  solution: string;
  doctorType: string;
  otherInfo: string;
  report_image: string;
}

interface Patient {
  name: string;
  date_of_birth: string;
  gender: string;
  address: string;
  profile_photo: string;
  past_medical_conditions: string;
  allergies: string;
  blood_pressure: string;
  weight: string;
  blood_group: string;
  medical_history: string;
  health_issues: HealthIssue[];
}

export const PatientDetails = ({
  event,
}: {
  event: { id: string; start: Date; end: Date; title: string; color: string };
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const [selectedHealthIssue, setSelectedHealthIssue] = useState(0);
  const handleBookAppointment = async () => {
    if (!selectedTimeSlot) {
      toast("Please select an appointment time.");
      return;
    }
    const appointmentData = {
      id: event.id,
      health_issues_id: selectedHealthIssue, // Replace with actual selected health issue ID
      appointment_date: selectedTimeSlot,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setAppointment`,
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // console.log(response);

      if (response.status === 201) {
        toast("Appointment booked successfully!");
      } else {
        alert("Failed to book the appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/doctor/getPatientWithHealthIssues`,
          { id: event.id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(response);

        setPatient(response.data.patient);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPatientDetails();
  }, [event.id, token]);

  if (!patient) return <p>Loading...</p>;

  const handleTimeSlotSelection = (selectedSlot: string) => {
    console.log(selectedTimeSlot);

    setSelectedTimeSlot(selectedSlot);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">Personal Detail</p>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                className="object-cover"
                src={patient.profile_photo}
              />
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{event.title} </p>
              <div className="text-muted-foreground flex gap-1 text-sm">
                <p>
                  <Phone size={15} className="inline" /> 987456321
                </p>
                •
                <p>
                  <Mail size={15} className="inline" /> m@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div>
            <ul className="mt-5 flex flex-col gap-3 text-sm font-semibold [&_span]:font-normal">
              <li>
                DOB: <span>{patient.date_of_birth}</span>
              </li>
              <li>
                Gender: <span>{patient.gender}</span>
              </li>
              <li>
                Medical History: <span>{patient.medical_history}</span>
              </li>
              <li>
                Address: <span>{patient.address}</span>
              </li>
              <li>
                Weight: <span>{patient.weight}</span>
              </li>
              <li>
                Blood Group: <span>{patient.blood_group}</span>
              </li>
            </ul>
          </div>
        </CardHeader>
      </Card>
      {patient.health_issues && (
        <>
          <p className="text-lg font-semibold">Ai Generated Diagnoses</p>
          <Card>
            <CardHeader>
              <CardTitle>Health Issues</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {patient.health_issues.map((issue, idx) => (
                <div key={idx} className="border-b pb-2 last:border-0">
                  {issue.diagnosis && (
                    <p className="font-medium text-blue-600">
                      Diagnosis*: {issue.diagnosis}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">
                    Symptoms: {issue.symptoms}
                  </p>
                  {issue.solution && (
                    <p className="text-sm text-gray-500">
                      Solution: {issue.solution}
                    </p>
                  )}
                  {issue.report_image && (
                    <div>
                      <a href={issue.report_image} target="_blank">
                        <Button variant="ghost" size="sm">
                          <FileImage /> Image
                        </Button>
                      </a>
                    </div>
                  )}
                  {issue.report_pdf && (
                    <div>
                      <a href={issue.report_pdf} target="_blank">
                        <Button variant="ghost" size="sm">
                          <FileImage /> Pdf
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
      <motion.div
        initial={{ height: 0 }}
        animate={{
          height: showReschedule ? 400 : 0,
        }}
        transition={{ duration: 0.5 }}
        className="flex h-40 w-full flex-col gap-3 overflow-hidden"
      >
        <DoctorAvailableTimee
          id={6}
          onTimeSlotSelect={handleTimeSlotSelection}
          role="doctor"
        />
        <Select
          onValueChange={(value) => setSelectedHealthIssue(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Issue" />
          </SelectTrigger>
          <SelectContent>
            {patient.health_issues.map((issue) => (
              <SelectItem
                value={issue.id.toString()}
                key={issue.id}
                className="capitalize"
              >
                {issue.diagnosis}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleBookAppointment}>
          Book Appointment
        </Button>
      </motion.div>
      <Button onClick={() => setShowReschedule(!showReschedule)}>
        Reschedule
      </Button>
    </div>
  );
};
