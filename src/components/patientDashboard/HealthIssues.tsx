import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, FileImage, Paperclip, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { NavLink } from "react-router";
import { Button } from "../ui/button";

interface MedicalReportEntry {
  id: string;
  symptoms: string;
  report_image: string | null;
  report_pdf: string | null;
  diagnosis: string;
  solution: string;
}

// const data = [
//   {
//     id: "1",
//     symptoms: "I feel restless and have trouble sleeping.",
//     report_image: null,
//     diagnosis: "pilonidal cyst",
//     date: "2023-10-15",
//   },
//   {
//     id: "2",
//     symptoms: "Persistent headache and sensitivity to light.",
//     report_image: null,
//     diagnosis: "migraine",
//     date: "2023-11-02",
//   },
//   {
//     id: "3",
//     symptoms: "Sore throat and difficulty swallowing.",
//     report_image: null,
//     diagnosis: "strep throat",
//     date: "2023-12-10",
//   },
//   {
//     id: "4",
//     symptoms: "Joint pain in knees and ankles, especially in the morning.",
//     report_image: null,
//     diagnosis: "rheumatoid arthritis",
//     date: "2024-01-05",
//   },
// ];
export const HealthIssues = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [healthIssues, setHealthIssues] = useState<MedicalReportEntry[]>();
  useEffect(() => {
    const fetchHealthIssues = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/getPatientHealthIssues`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (response.status === 200) {
          setHealthIssues(response.data.data);
        }
      } catch (error) {
        toast.error(String(error));
      }
    };
    fetchHealthIssues();
  }, [token]);
  return (
    <>
      <Card className="w-full">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ClipboardList className="h-6 w-6" />
            Medical Reports
          </CardTitle>
          <CardDescription>Patient assessments and diagnoses</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {healthIssues?.length ? (
              healthIssues.map((entry, index) => (
                <AccordionItem key={entry.id} value={entry.id}>
                  <AccordionTrigger className="hover:bg-muted/50 rounded-md px-4">
                    <div className="flex w-full flex-col justify-between gap-2 text-left sm:flex-row sm:items-center">
                      <span className="font-medium">Report #{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.diagnosis}</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium">
                          <Stethoscope className="text-primary h-4 w-4" />
                          Symptoms
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {entry.symptoms}
                        </p>
                      </div>

                      {entry.report_image ? (
                        <div>
                          <h3 className="mb-1 flex items-center gap-2 text-sm font-medium">
                            <FileImage className="text-primary h-4 w-4" />
                            Image
                          </h3>
                          <div className="overflow-hidden rounded-md border">
                            <img
                              src={entry.report_image || "/placeholder.svg"}
                              alt="Medical report image"
                              className="h-auto w-md object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="mb-1 flex items-center gap-2 text-sm font-medium">
                            <FileImage className="text-primary h-4 w-4" />
                            Image
                          </h3>
                          <div className="bg-muted/50 flex h-24 items-center justify-center overflow-hidden rounded-md border">
                            <p className="text-muted-foreground text-xs">
                              No image available
                            </p>
                          </div>
                        </div>
                      )}
                      {entry.report_pdf && (
                        <a
                          href={entry.report_pdf}
                          target="_blank"
                          className="flex gap-2 text-sm font-medium"
                        >
                          <Paperclip className="text-primary h-4 w-4" />
                          Report PDF
                        </a>
                      )}

                      <div>
                        <h3 className="mb-1 text-sm font-medium">Diagnosis*</h3>
                        <div className="bg-primary/5 rounded-md border p-2">
                          <p className="text-primary text-sm font-medium">
                            {entry.diagnosis}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <>
                <p>No issues found</p>
                <NavLink to="/patient/">
                  <Button>Add Issue</Button>
                </NavLink>
              </>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};
