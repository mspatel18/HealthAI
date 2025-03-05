import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const fetchUser = async (token: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/userProfile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const AuthLoader = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      fetchUser(token).then((user) => {
        if (user) {
          dispatch(setUser(user));
        }
      });
    }
  }, [token, dispatch]);

  return null; // This component only runs side effects
};

export default AuthLoader;
