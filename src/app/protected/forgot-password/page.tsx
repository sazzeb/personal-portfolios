import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthFrame
      title="Let’s get you back."
      description="Enter your account email to request a password reset link."
    >
      <AuthForm mode="forgot-password" />
    </AuthFrame>
  );
}
