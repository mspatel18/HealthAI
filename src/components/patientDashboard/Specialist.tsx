import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DoctorFilterDropdowns from "./FilterDoctors";
import { Separator } from "../ui/separator";
import { DoctorDialog } from "./DoctorDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface doctorInterface {
  id: number;
  name: string;
  specialization: string;
  consultation_fees: number;
  experience: number;
  profile_photo: string;
  degree: string;
}

export const Specialist = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [doctors, setDoctors] = useState<doctorInterface[] | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/getAllDoctorDetails`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setDoctors(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctors();
  }, [token]);

  const filteredDoctors = doctors?.filter((doctor) => {
    const matchesSpecialization =
      !selectedSpecialization ||
      doctor.specialization.toLowerCase() === selectedSpecialization;

    const matchesPrice =
      !selectedPriceRange ||
      (selectedPriceRange === "0-50" &&
        doctor.consultation_fees >= 0 &&
        doctor.consultation_fees <= 50) ||
      (selectedPriceRange === "51-100" &&
        doctor.consultation_fees > 50 &&
        doctor.consultation_fees <= 100) ||
      (selectedPriceRange === "101-150" &&
        doctor.consultation_fees > 100 &&
        doctor.consultation_fees <= 150) ||
      (selectedPriceRange === "151-200" &&
        doctor.consultation_fees > 150 &&
        doctor.consultation_fees <= 200) ||
      (selectedPriceRange === "200+" && doctor.consultation_fees > 200);

    return matchesSpecialization && matchesPrice;
  });

  return (
    <section className="px-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Welcome, Audrey!</h2>
      </div>
      <p className="mt-2 text-gray-500">Find the best doctors here</p>

      <div className="flex items-start justify-end">
        <DoctorFilterDropdowns
          onSpecializationChange={setSelectedSpecialization}
          onPriceRangeChange={setSelectedPriceRange}
        />
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        Recommended Doctors ({doctors ? filteredDoctors?.length : "Loading..."})
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors
          ? filteredDoctors?.map((doctor, index) => (
              <Card key={index} className="flex max-w-2xl flex-col">
                <CardHeader className="flex gap-4 p-2">
                  <div className="flex flex-row items-stretch justify-start gap-4">
                    <img
                      src={`${doctor.profile_photo}`}
                      alt={doctor.name}
                      className="aspect-square w-16 rounded-full object-cover"
                    />
                    <div className="flex flex-col justify-evenly">
                      <CardTitle className="text-lg font-medium">
                        {doctor.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {doctor.specialization}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="bg-secondary m-2 flex flex-col gap-1 rounded p-2">
                  <div className="flex flex-row items-center justify-between p-2">
                    <div className="font-semibold">
                      <p>{doctor.experience} years</p>
                      <p className="text-muted-foreground font-normal">
                        Experience
                      </p>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <p className="text-foreground text-xl font-bold">
                        ${doctor.consultation_fees}
                      </p>
                      <p className="text-muted-foreground">Consultation fee</p>
                    </div>
                  </div>
                  <DoctorDialog doctor={doctor} />
                </CardContent>
              </Card>
            ))
          : Array(8)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="flex max-w-2xl flex-col">
                  <CardHeader className="flex gap-4 p-2">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent className="bg-secondary m-2 flex flex-col gap-1 rounded p-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
      </div>
    </section>
  );
};
