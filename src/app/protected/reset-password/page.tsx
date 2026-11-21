import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function ResetPasswordPage() {
  return (
    <AuthFrame
      title="A fresh start."
      description="Enter the six-digit code from your email and choose a new password. Your link and code expire in 15 minutes."
    >
      <AuthForm mode="reset-password" />
    </AuthFrame>
  );
}
