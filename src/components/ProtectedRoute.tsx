import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ProtectedRoute = ({ role }: { role: string }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
