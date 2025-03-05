import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DoctorPersonalInfo } from "@/interface/doctor/personalInfo";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { medicalDegrees } from "@/config/medicalDegrees";
import { specializations } from "@/config/specializations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const DoctorProfile = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  // State for doctor details
  const [personalInfo, setPersonalInfo] = useState<Partial<DoctorPersonalInfo>>(
    {},
  );
  const [workInfo, setWorkInfo] = useState<Partial<DoctorPersonalInfo>>({});
  const [feeInfo, setFeeInfo] = useState<Partial<DoctorPersonalInfo>>({});
  const [availability, setAvailability] = useState<Partial<DoctorPersonalInfo>>(
    {},
  );
  const [editData, setEditData] = useState<Partial<DoctorPersonalInfo>>({});
  const [editWorkData, setEditWorkData] = useState<Partial<DoctorPersonalInfo>>(
    {},
  );
  const [editFeeData, setEditFeeData] = useState<Partial<DoctorPersonalInfo>>(
    {},
  );
  const [editAvailability, setEditAvailability] = useState<
    Partial<DoctorPersonalInfo>
  >({});
  // const [isEditing, setIsEditing] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [isEditingFees, setIsEditingFees] = useState(false);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Fetch Doctor Data
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const responses = await Promise.allSettled([
          axios.get(
            `${import.meta.env.VITE_BASE_URL}/doctor/getDoctorPersonalInfo`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          ),
          axios.get(
            `${import.meta.env.VITE_BASE_URL}/doctor/getDoctorWorkExperience`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          ),
          axios.get(`${import.meta.env.VITE_BASE_URL}/doctor/getDoctorFees`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(
            `${import.meta.env.VITE_BASE_URL}/doctor/getDoctorAvailability`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        ]);

        const [
          personalResponse,
          workResponse,
          feeResponse,
          availabilityResponse,
        ] = responses;

        if (personalResponse.status === "fulfilled") {
          setPersonalInfo(personalResponse.value.data.data);
          setEditData(personalResponse.value.data.data); // Pre-fill the edit form
        } else {
          console.error(
            "Error fetching personal details:",
            personalResponse.reason,
          );
        }

        if (workResponse.status === "fulfilled") {
          setWorkInfo(workResponse.value.data.data);
          setEditWorkData(workResponse.value.data.data);
        } else {
          console.error("Error fetching work experience:", workResponse.reason);
        }

        if (feeResponse.status === "fulfilled") {
          setFeeInfo(feeResponse.value.data.data);
          setEditFeeData(feeResponse.value.data.data);
        } else {
          console.error("Error fetching fee details:", feeResponse.reason);
        }
        if (availabilityResponse.status === "fulfilled") {
          setAvailability(availabilityResponse.value.data.data);
          setEditAvailability(availabilityResponse.value.data.data);
        } else {
          console.error(
            "Error fetching availability details:",
            availabilityResponse.reason,
          );
        }
      } catch (err) {
        toast.error("Something wrong occured");
        console.error("Unexpected error fetching doctor details:", err);
      }
    };

    fetchDoctorDetails();
  }, [token]);
  const handleUpdateProfile = async () => {
    setIsUploading(true);
    console.log(editData);

    try {
      const formData = new FormData();
      formData.append("name", editData.name || "");
      formData.append("date_of_birth", editData.date_of_birth || "");
      formData.append("gender", editData.gender || "");
      formData.append("nationality", editData.nationality || "");
      formData.append("languages_spoken", editData.languages_spoken || "");
      formData.append("degree", editData.degree || "");
      formData.append("specialization", editData.specialization || "");
      formData.append("license_number", editData.license_number || "");
      formData.append("phone_number", editData.phone_number || "");

      if (editData.profile_photo instanceof File) {
        formData.append("profile_photo", editData.profile_photo);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setDoctorPersonalInfo`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        setPersonalInfo(response.data.data);
        toast.success("Update successfull");
      } else {
        console.error("Error updating profile:", response.statusText);
        toast.error("Something wrong occured");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsUploading(false);
      setIsEditingProfile(false);
    }
  };
  const handleUpdateWorkProfile = async () => {
    setIsUploading(true);
    console.log(editWorkData);

    try {
      const formData = new FormData();
      formData.append(
        "current_hospital_clinic",
        editWorkData.current_hospital_clinic || "",
      );
      formData.append(
        "previous_workplaces",
        editWorkData.previous_workplaces || "",
      );
      formData.append(
        "internship_residency_details",
        editWorkData.internship_residency_details || "",
      );
      formData.append("experience", editWorkData.experience || "");

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setDoctorWorkExperience`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        setWorkInfo(response.data.data);
        toast.success("Update successfull");
      } else {
        console.error("Error updating profile:", response.statusText);
        toast.error("Something wrong occured");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something wrong occured");
    } finally {
      setIsUploading(false);
      setIsEditingWork(false);
    }
  };
  const handleUpdateFee = async () => {
    setIsUploading(true);
    // console.log(editWorkData);

    try {
      const formData = new FormData();
      formData.append(
        "consultation_fees",
        JSON.stringify(editFeeData.consultation_fees) || "",
      );
      formData.append(
        "payment_methods_accepted",
        editFeeData.payment_methods_accepted || "",
      );

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setDoctorFees`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(response);

      if (response.status === 201) {
        setFeeInfo(response.data.data);
        toast.success("Update successfull");
      } else {
        console.error("Error updating profile:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something wrong occured");
    } finally {
      setIsUploading(false);
      setIsEditingFees(false);
    }
  };
  const handleUpdateAvailability = async () => {
    setIsUploading(true);
    // console.log(editWorkData);

    try {
      const formData = new FormData();
      formData.append(
        "time_of_one_appointment",
        editAvailability.time_of_one_appointment || "",
      );
      formData.append(
        "online_consultation_availability",
        JSON.stringify(editAvailability.online_consultation_availability) || "",
      );
      formData.append(
        "walk_in_availability",
        JSON.stringify(editAvailability.walk_in_availability) || "",
      );
      formData.append(
        "appointment_booking_required",
        JSON.stringify(editAvailability.appointment_booking_required) || "",
      );

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/setDoctorAvailability`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);

      if (response.status === 201) {
        setAvailability(response.data.data);
        toast.success("Update successfull");
      } else {
        console.error("Error updating profile:", response.statusText);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something wrong occured");
    } finally {
      setIsUploading(false);
      setIsEditingAvailability(false);
    }
  };

  return (
    <section className="flex max-w-6xl flex-col items-start justify-start space-y-6 p-4">
      {/* Doctor Profile Header */}
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            className="object-cover"
            src={
              typeof personalInfo?.profile_photo === "string"
                ? personalInfo.profile_photo
                : undefined
            }
            alt="Doctor Profile"
          />
          <AvatarFallback>Dr</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {personalInfo?.name || "Doctor"}
            </h1>
            <Badge variant="outline" className="bg-green-100 text-emerald-700">
              DOCTOR
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Joined Since:{" "}
            {personalInfo?.created_at
              ? new Date(personalInfo.created_at).toDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Profile Information Cards */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Basic Information{" "}
              <Dialog
                open={isEditingProfile}
                onOpenChange={setIsEditingProfile}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Pencil size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-11/12 overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile details and save the changes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={editData.name || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dob" className="text-right">
                        Date of Birth
                      </Label>
                      <Input
                        type="text"
                        id="dob"
                        value={editData.date_of_birth || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            date_of_birth: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select
                        onValueChange={(value) =>
                          setEditData({
                            ...editData,
                            gender: value.toLowerCase(),
                          })
                        }
                        defaultValue={`${editData.gender?.toLowerCase()}`} // to update after api updatation
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="male" />
                        </SelectTrigger>
                        <SelectContent id="gender">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone_number" className="text-right">
                        Phone number
                      </Label>
                      <Input
                        type="text"
                        id="phone_number"
                        value={editData.phone_number || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="nationality" className="text-right">
                        Nationality
                      </Label>
                      <Input
                        type="text"
                        id="nationality"
                        value={editData.nationality || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            nationality: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="degree_id">Degree</Label>
                      <Select
                        onValueChange={(value) =>
                          setEditData({ ...editData, degree: value })
                        }
                        defaultValue={editData.degree}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicalDegrees.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="license_number" className="text-right">
                        License number
                      </Label>
                      <Input
                        type="text"
                        id="license_number"
                        value={editData.license_number || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            license_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Select
                          onValueChange={(value) =>
                            setEditData({ ...editData, specialization: value })
                          }
                          defaultValue={editData.specialization}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializations.map((specialization) => (
                              <SelectItem
                                key={specialization}
                                value={specialization}
                              >
                                {specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="languages" className="text-right">
                        Languages
                      </Label>
                      <Input
                        type="text"
                        id="languages"
                        value={editData.languages_spoken || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            languages_spoken: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile_photo" className="text-right">
                        Profile Photo
                      </Label>
                      <Input
                        type="file"
                        id="profile_photo"
                        // value={editData.profile_photo || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            profile_photo: e.target.files
                              ? e.target.files[0]
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Gender" value={personalInfo?.gender} />
            <InfoRow label="Birthday" value={personalInfo?.date_of_birth} />
            <InfoRow label="Phone number" value={personalInfo?.phone_number} />
            <InfoRow label="Nationality" value={personalInfo?.nationality} />
            <InfoRow label="Degree" value={personalInfo?.degree} />
            <InfoRow
              label="License Number"
              value={personalInfo?.license_number}
            />
            <InfoRow
              label="Specialization"
              value={personalInfo?.specialization}
            />
            <InfoRow
              label="Languages Spoken"
              value={personalInfo?.languages_spoken}
            />
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Work Information{" "}
              <Dialog open={isEditingWork} onOpenChange={setIsEditingWork}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Pencil size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Work Experience</DialogTitle>
                    <DialogDescription>
                      Update your experience details and save the changes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="experience" className="text-right">
                        experience
                      </Label>
                      <Input
                        id="experience"
                        value={editWorkData.experience || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditWorkData({
                            ...editWorkData,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="current_hospital_clinic"
                        className="text-right"
                      >
                        current_hospital_clinic
                      </Label>
                      <Input
                        id="current_hospital_clinic"
                        value={editWorkData.current_hospital_clinic || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditWorkData({
                            ...editWorkData,
                            current_hospital_clinic: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="previous_workplaces"
                        className="text-right"
                      >
                        previous_workplaces
                      </Label>
                      <Input
                        id="previous_workplaces"
                        value={editWorkData.previous_workplaces || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditWorkData({
                            ...editWorkData,
                            previous_workplaces: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="internship_residency_details"
                        className="text-right"
                      >
                        internship_residency_details
                      </Label>
                      <Input
                        id="internship_residency_details"
                        value={editWorkData.internship_residency_details || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditWorkData({
                            ...editWorkData,
                            internship_residency_details: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleUpdateWorkProfile}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow label="Experience" value={workInfo.experience} />
            <InfoRow
              label="current_hospital_clinic"
              value={workInfo?.current_hospital_clinic}
            />
            <InfoRow
              label="previous_workplaces"
              value={workInfo?.previous_workplaces}
            />
            <InfoRow
              label="internship_residency_details"
              value={workInfo?.internship_residency_details}
            />
          </CardContent>
        </Card>
        {/* Fee Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Fees Information{" "}
              <Dialog open={isEditingFees} onOpenChange={setIsEditingFees}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Pencil size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Fees</DialogTitle>
                    <DialogDescription>
                      Update your Fees details and save the changes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="consultation_fees" className="text-right">
                        consultation_fees
                      </Label>
                      <Input
                        id="consultation_fees"
                        value={editFeeData.consultation_fees || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditFeeData({
                            ...editFeeData,
                            consultation_fees: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="payment_methods_accepted"
                        className="text-right"
                      >
                        payment_methods_accepted
                      </Label>
                      <Input
                        id="payment_methods_accepted"
                        value={editFeeData.payment_methods_accepted || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditFeeData({
                            ...editFeeData,
                            payment_methods_accepted: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdateFee} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              label="consultation_fees"
              value={feeInfo?.consultation_fees}
            />
            <InfoRow
              label="payment_methods_accepted"
              value={feeInfo?.payment_methods_accepted}
            />
          </CardContent>
        </Card>
        {/* Availability Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Availability Information{" "}
              <Dialog
                open={isEditingAvailability}
                onOpenChange={setIsEditingAvailability}
              >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Pencil size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Availability</DialogTitle>
                    <DialogDescription>
                      Update your Availability details and save the changes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label
                        htmlFor="time_of_one_appointment"
                        className="text-right"
                      >
                        time_of_one_appointment
                      </Label>
                      <Input
                        id="time_of_one_appointment"
                        value={editAvailability.time_of_one_appointment || ""}
                        className="col-span-3"
                        onChange={(e) =>
                          setEditAvailability({
                            ...editAvailability,
                            time_of_one_appointment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="online_consultation_availability">
                          Online Consultation
                        </Label>
                        <input
                          type="checkbox"
                          id="online_consultation_availability"
                          checked={
                            editAvailability.online_consultation_availability
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            setEditAvailability({
                              ...editAvailability,
                              online_consultation_availability: e.target.checked
                                ? 1
                                : 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="walk_in_availability">Walk-in</Label>
                        <input
                          type="checkbox"
                          id="walk_in_availability"
                          checked={
                            editAvailability.walk_in_availability ? true : false
                          }
                          onChange={(e) =>
                            setEditAvailability({
                              ...editAvailability,
                              walk_in_availability: e.target.checked ? 1 : 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="appointment_booking_required">
                          Appointment Booking
                        </Label>
                        <input
                          type="checkbox"
                          id="appointment_booking_required"
                          checked={
                            editAvailability.appointment_booking_required
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            setEditAvailability({
                              ...editAvailability,
                              appointment_booking_required: e.target.checked
                                ? 1
                                : 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleUpdateAvailability}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              label="time_of_one_appointment"
              value={availability?.time_of_one_appointment}
            />
            <InfoRow
              label="online_consultation_availability"
              value={
                availability?.online_consultation_availability ? "Yes" : "No"
              }
            />
            <InfoRow
              label="walk_in_availability"
              value={availability?.walk_in_availability ? "Yes" : "No"}
            />
            <InfoRow
              label="appointment_booking_required"
              value={availability?.appointment_booking_required ? "Yes" : "No"}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

// **Reusable Components for Cleaner Code**
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex items-center gap-3">
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="capitalize">{value || "N/A"}</p>
    </div>
  </div>
);
