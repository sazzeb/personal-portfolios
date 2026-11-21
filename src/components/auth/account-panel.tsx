"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import styles from "./auth.module.scss";

interface AccountUser {
  id: string;
  name: string;
  email: string;
}

export function AccountPanel() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401) router.replace("/protected/login");
          throw new Error(result.message ?? "Unable to load your account.");
        }
        setUser(result.user);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your account.",
          );
      });
    return () => controller.abort();
  }, [router]);

  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok)
        throw new Error("Unable to sign out. Please try again.");
      router.replace("/protected/login");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {user ? (
        <>
          <p className={styles.success} role="status">
            You’re securely signed in.
          </p>
          <dl className={styles.profile}>
            <dt>Name</dt>
            <dd>{user.name}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </dl>
          <Button type="button" onClick={logout} disabled={busy}>
            {busy ? "Signing out…" : "Sign out"}
          </Button>
          <p className={styles.switchLink}>
            <Link href="/protected/forgot-password">Reset your password</Link>
          </p>
        </>
      ) : (
        <p role="status">{message || "Checking your session…"}</p>
      )}
      {user && message && (
        <p role="alert" className={styles.error}>
          {message}
        </p>
      )}
    </>
  );
}
