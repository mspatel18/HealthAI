import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorPersonalInfo } from "@/interface/doctor/personalInfo";

type Field = {
  label: string;
  key: string;
  type: "text" | "number" | "select" | "checkbox" | "file";
  options?: string[];
};

type EditDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  description: string;
  fields: Field[];
  data: Partial<DoctorPersonalInfo>;
  setData: (data: Partial<DoctorPersonalInfo>) => void;
  onSave: () => void;
  children: React.ReactNode;
};

export const EditDialog = ({
  isOpen,
  setIsOpen,
  title,
  description,
  fields,
  data,
  setData,
  onSave,
  children,
}: EditDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    key: string,
    value: string | number | boolean | File | undefined,
  ) => {
    setData({ ...data, [key]: value });
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    await onSave();
    setIsUploading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === "select" ? (
                <Select
                  onValueChange={(value) => handleChange(field.key, value)}
                  defaultValue={String(
                    data[field.key as keyof DoctorPersonalInfo],
                  )}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  id={field.key}
                  checked={Boolean(data[field.key as keyof DoctorPersonalInfo])}
                  onChange={(e) =>
                    handleChange(field.key, e.target.checked ? 1 : 0)
                  }
                />
              ) : field.type === "file" ? (
                <Input
                  type="file"
                  id={field.key}
                  onChange={(e) =>
                    handleChange(
                      field.key,
                      e.target.files ? e.target.files[0] : undefined,
                    )
                  }
                />
              ) : field.type === "text" ? (
                "asdf"
              ) : field.type === "number" ? (
                "qwer"
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
