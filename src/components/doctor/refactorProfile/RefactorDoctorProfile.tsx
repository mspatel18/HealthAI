import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DoctorPersonalInfo } from "@/interface/doctor/personalInfo";
import { toast } from "sonner";
import { doctorService } from "@/service/doctorService";
import { ProfileHeader } from "./ProfileHeader";
import { InfoCard } from "./InfoCard";
import { medicalDegrees } from "@/config/medicalDegrees";
import { specializations } from "@/config/specializations";

type DoctorData = {
  personal: Partial<DoctorPersonalInfo>;
  work: Partial<DoctorPersonalInfo>;
  fees: Partial<DoctorPersonalInfo>;
  availability: Partial<DoctorPersonalInfo>;
};

export const RefactorDoctorProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [data, setData] = useState<DoctorData>({
    personal: {},
    work: {},
    fees: {},
    availability: {},
  });
  const [editData, setEditData] = useState<DoctorData>({
    personal: {},
    work: {},
    fees: {},
    availability: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [personal, work, fees, availability] =
          await doctorService.fetchDoctorDetails(token!);
        setData({ personal, work, fees, availability });
        setEditData({ personal, work, fees, availability });
      } catch (err) {
        toast.error("Failed to fetch doctor details" + String(err));
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleUpdate = async (section: keyof DoctorData, endpoint: string) => {
    try {
      const updatedData = await doctorService.updateDoctorData(
        endpoint,
        prepareFormData(editData[section]),
        token!,
      );
      setData((prev) => ({ ...prev, [section]: updatedData }));
      toast.success("Update successful");
    } catch (err) {
      toast.error("Failed to update data" + String(err));
    }
  };

  const prepareFormData = (sectionData: Partial<DoctorPersonalInfo>) => {
    const formData = new FormData();
    Object.entries(sectionData).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value),
      );
    });
    return formData;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="flex max-w-6xl flex-col items-start justify-start space-y-6 p-4">
      <ProfileHeader personalInfo={data.personal} />
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <InfoCard
          title="Basic Information"
          data={data.personal}
          editData={editData.personal}
          setEditData={(newData) =>
            setEditData({ ...editData, personal: newData })
          }
          onSave={() =>
            handleUpdate("personal", "/doctor/setDoctorPersonalInfo")
          }
          fields={[
            { label: "Name", key: "name", type: "text" },
            { label: "Date of Birth", key: "date_of_birth", type: "text" },
            {
              label: "Gender",
              key: "gender",
              type: "select",
              options: ["male", "female"],
            },
            { label: "Phone Number", key: "phone_number", type: "text" },
            { label: "Nationality", key: "nationality", type: "text" },
            {
              label: "Degree",
              key: "degree",
              type: "select",
              options: medicalDegrees,
            },
            { label: "License Number", key: "license_number", type: "text" },
            {
              label: "Specialization",
              key: "specialization",
              type: "select",
              options: specializations,
            },
            {
              label: "Languages Spoken",
              key: "languages_spoken",
              type: "text",
            },
          ]}
        />
        <InfoCard
          title="Work Information"
          data={data.work}
          editData={editData.work}
          setEditData={(newData) => setEditData({ ...editData, work: newData })}
          onSave={() => handleUpdate("work", "/doctor/setDoctorWorkExperience")}
          fields={[
            { label: "Experience", key: "experience", type: "text" },
            {
              label: "Current Hospital/Clinic",
              key: "current_hospital_clinic",
              type: "text",
            },
            {
              label: "Previous Workplaces",
              key: "previous_workplaces",
              type: "text",
            },
            {
              label: "Internship/Residency",
              key: "internship_residency_details",
              type: "text",
            },
          ]}
        />
        <InfoCard
          title="Fees Information"
          data={data.fees}
          editData={editData.fees}
          setEditData={(newData) => setEditData({ ...editData, fees: newData })}
          onSave={() => handleUpdate("fees", "/doctor/setDoctorFees")}
          fields={[
            {
              label: "Consultation Fees",
              key: "consultation_fees",
              type: "number",
            },
            {
              label: "Payment Methods",
              key: "payment_methods_accepted",
              type: "text",
            },
          ]}
        />
        <InfoCard
          title="Availability Information"
          data={data.availability}
          editData={editData.availability}
          setEditData={(newData) =>
            setEditData({ ...editData, availability: newData })
          }
          onSave={() =>
            handleUpdate("availability", "/doctor/setDoctorAvailability")
          }
          fields={[
            {
              label: "Time per Appointment",
              key: "time_of_one_appointment",
              type: "text",
            },
            {
              label: "Online Consultation",
              key: "online_consultation_availability",
              type: "checkbox",
            },
            {
              label: "Walk-in Availability",
              key: "walk_in_availability",
              type: "checkbox",
            },
            {
              label: "Booking Required",
              key: "appointment_booking_required",
              type: "checkbox",
            },
          ]}
        />
      </div>
    </section>
  );
};
