import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
export const PatientHome = () => {
  const [profile, setProfile] = useState(null);
  const token = useSelector((state: RootState) => state.auth.token);
  // console.log(token);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/profile`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // console.log("Result", response);
        setProfile(response.data.name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [token]);
  return <div className="w-full px-3">{profile}</div>;
};
