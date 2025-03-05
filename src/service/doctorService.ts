import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const headers = (token: string) => ({
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
});

export const doctorService = {
  fetchDoctorDetails: async (token: string) => {
    const endpoints = [
      "/doctor/getDoctorPersonalInfo",
      "/doctor/getDoctorWorkExperience",
      "/doctor/getDoctorFees",
      "/doctor/getDoctorAvailability",
    ];

    const responses = await Promise.allSettled(
      endpoints.map((endpoint) =>
        axios.get(`${BASE_URL}${endpoint}`, { headers: headers(token) }),
      ),
    );

    return responses.map((res) =>
      res.status === "fulfilled" ? res.value.data.data : null,
    );
  },

  updateDoctorData: async (endpoint: string, data: FormData, token: string) => {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: headers(token),
    });
    return response.data.data;
  },
};
