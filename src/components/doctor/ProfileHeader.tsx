import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DoctorPersonalInfo } from "@/interface/doctor/personalInfo";

export const ProfileHeader = ({
  personalInfo,
}: {
  personalInfo: Partial<DoctorPersonalInfo>;
}) => (
  <div className="mb-6 flex items-center gap-4">
    <Avatar className="h-16 w-16">
      <AvatarImage
        className="object-cover"
        src={
          typeof personalInfo.profile_photo === "string"
            ? personalInfo.profile_photo
            : undefined
        }
        alt="Doctor Profile"
      />
      <AvatarFallback>Dr</AvatarFallback>
    </Avatar>
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">{personalInfo.name || "Doctor"}</h1>
        <Badge variant="outline" className="bg-green-100 text-emerald-700">
          DOCTOR
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">
        Joined Since:{" "}
        {personalInfo.created_at
          ? new Date(personalInfo.created_at).toDateString()
          : "N/A"}
      </p>
    </div>
  </div>
);
