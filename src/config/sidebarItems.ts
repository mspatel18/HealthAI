// src/config/sidebarItems.ts
import {
  LucideIcon,
  Home,
  Activity,
  BriefcaseMedical,
  Clock,
  User,
  Calendar,
  ClipboardPlus,
} from "lucide-react";

// Define the type for menu items
export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

// Sidebar menu items array
export const sidebarItems: SidebarItem[] = [
  // { title: "Home", url: "/patient", icon: Home },
  { title: "Diagnose", url: "/patient", icon: Activity },
  {
    title: "Health Issues",
    url: "/patient/health-issues",
    icon: ClipboardPlus,
  },
  {
    title: "Specialists",
    url: "/patient/specialist",
    icon: BriefcaseMedical,
  },
  { title: "Profile", url: "/patient/profile", icon: User },
];
export const doctorSidebarItems: SidebarItem[] = [
  { title: "Home", url: "/doctor", icon: Home },
  { title: "Appointments", url: "/doctor/appointments", icon: Calendar },
  { title: "Set Availability", url: "/doctor/set-availability", icon: Clock },
  { title: "Profile", url: "/doctor/profile", icon: User },
];
