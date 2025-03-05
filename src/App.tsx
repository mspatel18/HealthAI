import { BrowserRouter, Routes, Route } from "react-router";
// import { AuthProvider } from "@/context/AuthProvider";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/DashboardLayout";
import ScrollToTop from "@/components/ScrollToTop";
import { Diagnose } from "@/components/patientDashboard/Diagnose";
import { Profile } from "./components/patientDashboard/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Specialist } from "./components/patientDashboard/Specialist";
import { DoctorHome } from "./components/doctor/DoctorHome";
import { NotFound } from "./components/NotFound";
import { AppointmentCalendar } from "./components/doctor/AppointmentCalendar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { DoctorProfile } from "./components/doctor/DoctorProfile";
import { DoctorRegister } from "./pages/DoctorRegister";
import SetAvailability from "./components/doctor/SetAvailability";
import { HealthIssues } from "./components/patientDashboard/HealthIssues";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctor-register" element={<DoctorRegister />} />
            <Route path="patient" element={<ProtectedRoute role="patient" />}>
              {/* <Route index element={<PatientHome />} /> */}
              <Route path="" element={<Dashboard />}>
                <Route index element={<Diagnose />} />
                {/* <Route path="diagnose" element={< />} /> */}
                <Route path="profile" element={<Profile />} />
                <Route path="specialist" element={<Specialist />} />
                <Route path="health-issues" element={<HealthIssues />} />
              </Route>
            </Route>
            <Route path="doctor" element={<ProtectedRoute role="doctor" />}>
              <Route path="" element={<Dashboard />}>
                <Route index element={<DoctorHome />} />
                <Route path="appointments" element={<AppointmentCalendar />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="set-availability" element={<SetAvailability />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
