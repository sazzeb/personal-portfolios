import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthFrame
      title="Make a connection."
      description="Create your account to get started."
    >
      <AuthForm mode="register" />
    </AuthFrame>
  );
}
