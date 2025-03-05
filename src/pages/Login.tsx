import { LoginForm } from "@/components/LoginForm";
import { ScanHeart } from "lucide-react";
import { NavLink } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";
// import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
export const Login = () => {
  // const { user, isLoading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);
  return (
    <section className="bg-muted flex h-screen flex-col items-center justify-center gap-8 px-12">
      {/* {isLoading ? (
        <>
          <div>Loading...</div>
        </>
      ) : ( */}
      <>
        <NavLink
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <ScanHeart className="size-4" />
          </div>
          Health.ai
        </NavLink>
        <LoginForm />
      </>
      {/* )} */}
    </section>
  );
};
