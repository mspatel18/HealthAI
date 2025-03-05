import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, ScanHeart, Paperclip, RefreshCw, FileImage } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HealthIssueInterface {
  id: number;
  patient_id: number;
  symptoms: string | null;
  report_image: File | string | null;
  report_image_type: string;
  report_pdf: File | string | null;
  diagnosis: string;
  solution: string | null;
  created_at: string;
  updated_at: string;
}
// const data = {
//   patient_id: 5,
//   symptoms:
//     "I feel restless and have trouble sleeping. My energy levels are unpredictable, sometimes I feel extremely hungry and tired, other times I'm full of energy. I often experience lethargy and weakness, even after getting enough rest. I've noticed I've been losing weight without trying, and I get fatigued easily. My vision is blurry and distorted at times, which is concerning. I'm urinating more frequently than usual, and I've been experiencing increased thirst and appetite. Healing from minor cuts and scrapes seems to take longer than it used to. I have random itching sensations all over my body, and I've had several yeast infections recently. My hands and feet feel numb occasionally, which is unusual.",
//   report_pdf: null,
//   report_image: null,
//   diagnosis: "jANLEVA BIMARI",
//   solution: null,
//   updated_at: "2025-03-04T06:24:26.000000Z",
//   created_at: "2025-03-04T06:24:26.000000Z",
//   id: 35,
// };
export const Diagnose = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [message, setMessage] = useState<Partial<HealthIssueInterface>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthIssueInterface | null>(null);
  const prompts = ["Running nose", "Fever with headache", "Red eyes"];

  const handleSubmit = async () => {
    setLoading(true);
    // setResult(data);
    // setLoading(false);
    const formData = new FormData();
    if (message.symptoms) {
      formData.append("symptoms", message.symptoms);
    }
    if (message.report_image instanceof File) {
      formData.append("report_image", message.report_image);
    }
    if (message.report_pdf instanceof File) {
      formData.append("report_pdf", message.report_pdf);
    }
    if (message.report_image_type) {
      formData.append("report_image_type", message.report_image_type);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/patient/addHealthIssue`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Response:", response);
      if (response.status === 201) {
        // Set the result with the response data
        setResult(response.data.data);
      }
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
      toast.error("Failed to submit diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setMessage({});
  };

  // For demo purposes, uncomment this to auto-load the example data
  // useEffect(() => {
  //   const demoData = {
  //     patient_id: 5,
  //     symptoms: "I feel restless and have trouble sleeping. My energy levels are unpredictable, sometimes I feel extremely hungry and tired, other times I'm full of energy. I often experience lethargy and weakness, even after getting enough rest. I've noticed I've been losing weight without trying, and I get fatigued easily. My vision is blurry and distorted at times, which is concerning. I'm urinating more frequently than usual, and I've been experiencing increased thirst and appetite. Healing from minor cuts and scrapes seems to take longer than it used to. I have random itching sensations all over my body, and I've had several yeast infections recently. My hands and feet feel numb occasionally, which is unusual.",
  //     report_pdf: null,
  //     report_image: null,
  //     diagnosis: "Diabetes mellitus type 2",
  //     solution: "Schedule an appointment with an endocrinologist for proper evaluation and treatment. Monitor blood sugar levels regularly and consider lifestyle changes including diet modifications and increased physical activity.",
  //     updated_at: "2025-03-04T06:24:26.000000Z",
  //     created_at: "2025-03-04T06:24:26.000000Z",
  //     id: 35
  //   };
  //   setResult(demoData as HealthIssueInterface);
  // }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-[80vh] flex-col items-center justify-center p-4 text-center sm:p-6"
    >
      {!result ? (
        // Input Form UI
        <>
          <div className="bg-primary rounded-full p-4">
            <ScanHeart size={32} className="text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            How do you feel Today?
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Tell me your symptoms to get AI-generated Diagnoses
          </p>
          <div className="mt-6 flex w-full max-w-lg flex-wrap justify-center gap-2">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="cursor-pointer rounded-full px-3 py-2 text-xs font-medium"
                onClick={() => setMessage({ ...message, symptoms: prompt })}
              >
                {prompt}
              </Button>
            ))}
          </div>
          <div className="mt-6 flex w-full max-w-xl flex-col rounded-lg border border-gray-300 bg-white shadow-md md:max-w-[60vw]">
            <textarea
              className="w-full resize-none border-none p-3 text-sm outline-0 sm:text-base"
              placeholder="Get your medical diagnosis with help of AI..."
              wrap="soft"
              rows={
                message?.symptoms
                  ? Math.min(4, message.symptoms.split("\n").length + 1)
                  : 1
              }
              value={message?.symptoms || ""}
              onChange={(e) =>
                setMessage({ ...message, symptoms: e.target.value })
              }
            />
            <div className="mt-6 flex flex-col items-stretch border-t border-t-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Label htmlFor="image-type">
                    <Select
                      onValueChange={(value) =>
                        setMessage({
                          ...message,
                          report_image_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Image Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brain">Brain MRI</SelectItem>
                        <SelectItem value="lung">Lung Xray</SelectItem>
                        <SelectItem value="skin">Skin Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </Label>
                  <Label htmlFor="select-file">
                    <FileImage size={20} className="m-1 cursor-pointer" />
                  </Label>
                  <Input
                    id="select-file"
                    type="file"
                    accept=".jpg,.png"
                    className="hidden"
                    onChange={(e) =>
                      setMessage({
                        ...message,
                        report_image: e.target.files
                          ? e.target.files[0]
                          : undefined,
                      })
                    }
                  />
                  <Label
                    htmlFor="select-pdf"
                    className="flex cursor-pointer items-center justify-center"
                  >
                    <p>Attach PDF</p>
                    <Paperclip size={20} className="m-1" />
                    <Input
                      id="select-pdf"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) =>
                        setMessage({
                          ...message,
                          report_pdf: e.target.files
                            ? e.target.files[0]
                            : undefined,
                        })
                      }
                    />
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-full p-2 text-white"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Diagnose"} <Send size={18} />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground p-2 text-sm">
                AI-generated response can make mistakes. Consult a doctor before
                taking any medication.
              </p>
            </div>
          </div>
        </>
      ) : (
        // Result Display UI
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            AI Diagnosis Results
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Based on the symptoms you provided
          </p>

          <div className="mt-6 flex w-full max-w-xl flex-col rounded-lg border border-gray-300 bg-white shadow-md md:max-w-[60vw]">
            <div className="border-b border-b-gray-200 p-3">
              <h3 className="text-left text-lg font-semibold text-gray-800">
                Your Symptoms
              </h3>
              <p className="mt-2 text-left text-sm text-gray-600">
                {result.symptoms}
              </p>
            </div>
            {result.report_pdf && (
              <div className="border-b border-b-gray-200 p-3">
                {typeof result.report_pdf === "string" && (
                  <a href={result.report_pdf}>PDF Report</a>
                )}
              </div>
            )}
            {result.report_image && (
              <div className="border-b border-b-gray-200 p-3">
                {typeof result.report_image === "string" && (
                  <a
                    href={result.report_image}
                    className="text-left text-lg font-semibold text-gray-800"
                  >
                    Image
                  </a>
                )}
              </div>
            )}
            <div className="border-b border-b-gray-200 p-3">
              <h3 className="text-left text-lg font-semibold text-gray-800">
                Possible Diagnosis
              </h3>
              <div className="mt-2 rounded-md bg-blue-50 p-3 text-left">
                <p className="font-medium text-blue-800">{result.diagnosis}</p>
              </div>
            </div>

            {result.solution && (
              <div className="border-b border-b-gray-200 p-3">
                <h3 className="text-left text-lg font-semibold text-gray-800">
                  Recommended Steps
                </h3>
                <p className="mt-2 text-left text-sm text-gray-600">
                  {result.solution}
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-col items-stretch bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-3">
              <div className="flex justify-between">
                <div className="text-left">
                  <p className="text-xs text-gray-500">
                    Diagnosis ID: {result.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Generated on: {new Date(result.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-full p-2 text-white"
                    onClick={resetForm}
                  >
                    New Diagnosis <RefreshCw size={18} />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mt-3 p-2 text-sm">
                AI-generated response can make mistakes. Consult a doctor before
                taking any medication.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
