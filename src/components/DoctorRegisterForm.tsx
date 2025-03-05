import { useState, ChangeEvent, FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { specializations } from "@/config/specializations";
import { medicalDegrees } from "@/config/medicalDegrees";
import { NavLink, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  degree: string;
  date_of_birth: string;
  gender: string;
  specialization: string;
  license_number: string;
  bio: string;
  role: string;
  password: string;
  password_confirmation: string;
}

export function DoctorRegisterForm({
  className,
  ...props
}: {
  className?: string;
}) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    phone_number: "",
    degree: "",
    specialization: "",
    license_number: "",
    bio: "",
    role: "doctor",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // const handleSpecializationChange = (value: string) => {
  //   setFormData({ ...formData, specialization_id: parseInt(value, 10) });
  // };
  // const handleSelectChange = (value: string) => {
  //   setFormData({ ...formData, gender: value });
  // };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log(formData);
      //TODO change to axios
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();
      if (result.token) {
        const { user, token } = result;
        dispatch(login({ user, token }));
        navigate("/dashboard");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Let's get started. Fill in the details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">Contact Number</Label>
                  <Input
                    id="phone_number"
                    type="text"
                    placeholder="987453210"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    placeholder="987453210"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/*  */}
                <div>
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    type="text"
                    placeholder="DOC1234"
                    required
                    value={formData.license_number}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="degree_id">Degree</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, degree: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Degree" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalDegrees.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, specialization: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((specialization) => (
                        <SelectItem key={specialization} value={specialization}>
                          {specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="*********"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="*********"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </div>
            <div>
              <div className="mb-2 text-center text-sm">
                Already have an account?{" "}
                <NavLink to="/login" className="underline underline-offset-4">
                  Login
                </NavLink>
              </div>
              <div className="text-center text-sm">
                Want to register as patient?{" "}
                <NavLink
                  to="/register"
                  className="underline underline-offset-4"
                >
                  Register as Patient
                </NavLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
