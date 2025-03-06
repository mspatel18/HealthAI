import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { NavLink } from "react-router";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleGenerateOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/generateOtp`,
        { email },
      );
      toast(response.data.message);
      setStep(2);
    } catch (error) {
      toast("Error generating OTP: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/verifyOtp`,
        {
          email,
          otp,
          password,
        },
      );
      toast(response.data.message);
      setStep(3);
    } catch (error) {
      toast("Invalid OTP or error verifying OTP: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Card className="w-96 p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password?</CardTitle>
          <CardDescription>Enter you email below to reset</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <>
              <form onSubmit={handleGenerateOtp}>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mb-4"
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <form onSubmit={handleVerifyOtp}>
                <Label>OTP</Label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="mb-4"
                />
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mb-4"
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-green-500">Password reset successfully!</p>
              <NavLink to="/login">
                <Button>Login again</Button>
              </NavLink>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
