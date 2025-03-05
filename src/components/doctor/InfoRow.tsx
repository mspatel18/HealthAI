type InfoRowProps = {
  label: string;
  value?: string | number | boolean | File | Date;
  type: string;
};

export const InfoRow = ({ label, value, type }: InfoRowProps) => {
  const displayValue =
    type === "checkbox"
      ? value
        ? "Yes"
        : "No"
      : value instanceof File
        ? value.name
        : value instanceof Date
          ? value.toLocaleDateString()
          : value || "N/A";

  return (
    <div className="flex items-center gap-3">
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="capitalize">{displayValue}</p>
      </div>
    </div>
  );
};
