import { ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useNavigate } from "react-router";
// import { useAuth } from "@/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";
export function NavUser() {
  const { isMobile, toggleSidebar } = useSidebar();
  const navigate = useNavigate(); // Initialize navigation
  // const { logout, user } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  // const  = JSON.parse(localStorage.getItem("user") || "{}");
  const handleLogout = () => {
    dispatch(logout());
    navigate("/ ");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    typeof user?.profile_photo === "string"
                      ? user.profile_photo
                      : undefined
                  }
                  alt="Avatar"
                />
                <AvatarFallback className="">
                  {user?.name.toUpperCase()[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      typeof user?.profile_photo === "string"
                        ? user.profile_photo
                        : undefined
                    }
                    alt="Avatar"
                  />
                  <AvatarFallback className="">
                    {user?.name.toUpperCase()[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <NavLink to={`/${user?.role}/profile`}>
                <DropdownMenuItem
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                  }}
                >
                  <User />
                  Profile
                </DropdownMenuItem>
              </NavLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
