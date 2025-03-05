"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // Ensure this utility exists

const specializations = [
  { label: "Cardiology", value: "cardiology" },
  { label: "Dermatology", value: "dermatology" },
  { label: "Neurology", value: "neurology" },
  { label: "Pediatrics", value: "pediatrics" },
  { label: "Orthopedics", value: "orthopedics" },
  { label: "Gynecology", value: "gynecology" },
  { label: "Oncology", value: "oncology" },
  { label: "Psychiatry", value: "psychiatry" },
  { label: "Ophthalmology", value: "ophthalmology" },
  { label: "ENT", value: "ent" },
  { label: "Endocrinology", value: "endocrinology" },
  { label: "Gastroenterology", value: "gastroenterology" },
  { label: "Nephrology", value: "nephrology" },
  { label: "Pulmonology", value: "pulmonology" },
  { label: "Urology", value: "urology" },
  { label: "Rheumatology", value: "rheumatology" },
  { label: "Hematology", value: "hematology" },
  { label: "Anesthesiology", value: "anesthesiology" },
  { label: "Radiology", value: "radiology" },
  { label: "Pathology", value: "pathology" },
  { label: "General Surgery", value: "general-surgery" },
  { label: "Plastic Surgery", value: "plastic-surgery" },
];

const priceRanges = [
  { label: "$0 - $50", value: "0-50" },
  { label: "$51 - $100", value: "51-100" },
  { label: "$101 - $150", value: "101-150" },
  { label: "$151 - $200", value: "151-200" },
  { label: "$200+", value: "200+" },
];

// const localities = [
//   { label: "Downtown", value: "downtown" },
//   { label: "Uptown", value: "uptown" },
//   { label: "Midtown", value: "midtown" },
//   { label: "Suburbs", value: "suburbs" },
//   { label: "West End", value: "west-end" },
// ];

function FilterDropdown({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: { label: string; value: string }[];
  onSelect: (value: string | null) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : title}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValue =
                      selectedValue === option.value ? null : option.value;
                    setSelectedValue(newValue);
                    onSelect(newValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "text-primary mr-2 h-4 w-4",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function DoctorFilterDropdowns({
  onSpecializationChange,
  onPriceRangeChange,
}: {
  onSpecializationChange: (value: string | null) => void;
  onPriceRangeChange: (value: string | null) => void;
}) {
  return (
    <div className="flex flex-col space-y-3 sm:flex-row md:space-y-0 md:space-x-4">
      <FilterDropdown
        title="Specialization"
        options={[{ label: "Show All", value: "" }, ...specializations]}
        onSelect={onSpecializationChange}
      />
      <FilterDropdown
        title="Price Range"
        options={[{ label: "Show All", value: "" }, ...priceRanges]}
        onSelect={onPriceRangeChange}
      />
    </div>
  );
}
