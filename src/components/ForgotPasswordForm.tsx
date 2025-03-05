import { useState } from "react";

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
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const ForgotPasswordForm = ({
  className,
  ...props
}: {
  className?: string;
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + Password, 3: Success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock API call to request OTP
      // In a real application, replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful OTP generation
      setSuccess("OTP has been sent to your email address");
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP. Please try again." + String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call to verify OTP and reset password
      // In a real application, replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful password reset
      setSuccess("Password has been reset successfully");
      setStep(3);
    } catch (err) {
      setError(
        "Invalid OTP or password reset failed. Please try again." + String(err),
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your email</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <form
            // onSubmit={handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
          > */}
          {step === 1 && (
            <>
              {error && (
                <div className="mb-4 flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestOTP}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
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
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-center text-2xl font-semibold">
                Verify & Reset
              </h1>
              <p className="mt-2 mb-6 text-center text-gray-600">
                Enter the verification code sent to your email and set a new
                password
              </p>

              {error && (
                <div className="mb-4 flex items-center rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 flex items-center rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label
                    htmlFor="otp"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="newPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-70"
                >
                  {isLoading ? "Verifying..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
          {/* </form> */}
        </CardContent>
      </Card>
    </div>
  );
};
