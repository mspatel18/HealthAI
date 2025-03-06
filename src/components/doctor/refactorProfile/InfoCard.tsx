import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DoctorPersonalInfo } from "@/interface/doctor/personalInfo";
import { EditDialog } from "./EditDialog";
import { InfoRow } from "./InfoRow";
import { useState } from "react";

type Field = {
  label: string;
  key: string;
  type: "text" | "number" | "select" | "checkbox" | "file";
  options?: string[];
};

type InfoCardProps = {
  title: string;
  data: Partial<DoctorPersonalInfo>;
  editData: Partial<DoctorPersonalInfo>;
  setEditData: (data: Partial<DoctorPersonalInfo>) => void;
  onSave: () => void;

  fields: Field[];
};

export const InfoCard = ({
  title,
  data,
  editData,
  setEditData,
  onSave,
  fields,
}: InfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <EditDialog
            isOpen={isEditing}
            setIsOpen={setIsEditing}
            title={`Edit ${title}`}
            description={`Update your ${title.toLowerCase()} details.`}
            fields={fields}
            data={editData}
            setData={setEditData}
            onSave={onSave}
          >
            <Button size="sm" variant="outline">
              <Pencil size={15} />
            </Button>
          </EditDialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <InfoRow
            key={field.key}
            label={field.label}
            value={data[field.key as keyof DoctorPersonalInfo]}
            type={field.type}
          />
        ))}
      </CardContent>
    </Card>
  );
};
