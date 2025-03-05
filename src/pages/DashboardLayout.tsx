import { useLocation } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router";
import { sidebarItems } from "@/config/sidebarItems";
import { Toaster } from "@/components/ui/sonner";

export const Dashboard = () => {
  const location = useLocation();

  // Find the matching title based on the current route
  const currentTitle =
    sidebarItems.find((item) => item.url === location.pathname)?.title ||
    "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-2">
        <header className="bg-sidebar sticky top-2 z-50 flex h-16 w-full shrink-0 items-center gap-2 rounded-lg border transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>{currentTitle}</div>
          </div>
        </header>
        <main className="mt-4">
          <Outlet />
          <Toaster theme="light" richColors />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
