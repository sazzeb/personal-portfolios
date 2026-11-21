import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthFrame
      title="Welcome back."
      description="Sign in to your Eko Samuel account."
    >
      <AuthForm mode="login" />
    </AuthFrame>
  );
}
