"use client";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  authRoutes,
  emailError,
  nameError,
  passwordStrength,
} from "@/lib/auth-validation";
import styles from "./auth.module.scss";
export type AuthMode =
  "login" | "register" | "forgot-password" | "reset-password";
const labels = {
  login: "Sign in",
  register: "Create account",
  "forgot-password": "Send reset link",
  "reset-password": "Update password",
};
const empty = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  code: "",
};
function subscribe() {
  return () => {};
}
export function AuthForm({ mode }: { mode: AuthMode }) {
  const id = useId(),
    router = useRouter();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [values, setValues] = useState(empty),
    [touched, setTouched] = useState<Record<string, boolean>>({}),
    [score, setScore] = useState<number | null>(null);
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [success, setSuccess] = useState(false);
  const locked = useRef(false),
    newPassword = mode === "register" || mode === "reset-password";
  useEffect(() => {
    if (!newPassword || !values.password) return;
    let active = true;
    const timer = setTimeout(() => {
      passwordStrength(values.password, [
        values.name,
        values.email,
        values.email.split("@")[0],
      ])
        .then((result) => {
          if (active) setScore(result);
        })
        .catch(() => {
          if (active) setScore(0);
        });
    }, 180);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [newPassword, values.password, values.name, values.email]);
  function error(field: keyof typeof empty, strength = score) {
    if (field === "name") return nameError(values.name);
    if (field === "email") return emailError(values.email);
    if (field === "code")
      return /^[0-9]{6}$/.test(values.code)
        ? ""
        : "Enter the six-digit code in your reset email.";
    if (field === "confirmPassword")
      return values.confirmPassword &&
        values.confirmPassword === values.password
        ? ""
        : "Your passwords do not match.";
    if (!values.password) return "Enter your password.";
    if (
      newPassword &&
      (Array.from(values.password).length < 15 ||
        Array.from(values.password).length > 128)
    )
      return "Use 15–128 characters. A long, unique passphrase works well.";
    return newPassword && (strength === null || strength < 3)
      ? "Avoid common passwords, names, sequences and repeated patterns."
      : "";
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    setSuccess(false);
    const token =
      new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    if (mode === "reset-password" && !/^[A-Za-z0-9_-]{43}$/.test(token)) {
      setMessage("This reset link is invalid. Request a new link.");
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const fields: (keyof typeof empty)[] =
        mode === "register"
          ? ["name", "email", "password", "confirmPassword"]
          : mode === "reset-password"
            ? ["code", "password", "confirmPassword"]
            : mode === "login"
              ? ["email", "password"]
              : ["email"];
      setTouched(Object.fromEntries(fields.map((field) => [field, true])));
      const strength = newPassword
        ? await passwordStrength(values.password, [
            values.name,
            values.email,
            values.email.split("@")[0],
          ])
        : null;
      setScore(strength);
      const problem = fields
        .map((field) => error(field, strength))
        .find(Boolean);
      if (problem) {
        setMessage(problem);
        return;
      }
      setMessage("");
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(mode === "reset-password" ? { token } : {}),
        }),
        signal: AbortSignal.timeout(35_000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error(result.message ?? "Please try again later.");
      setValues(empty);
      setTouched({});
      setScore(null);
      setSuccess(true);
      setMessage(result.message ?? "You are signed in.");
      if (mode === "login") {
        window.location.replace(authRoutes.account);
      }
      if (mode === "register" || mode === "reset-password") {
        router.replace(authRoutes.login);
      }
    } catch (failure) {
      setMessage(
        failure instanceof Error && failure.name === "Error"
          ? failure.message
          : "Unable to connect. Please try again later.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  function field(name: keyof typeof empty, label: string, type = "text") {
    const visible = touched[name] || !!values[name],
      problem = error(name);
    return (
      <label className={styles.field} htmlFor={`${id}-${name}`}>
        <span>{label}</span>
        <input
          id={`${id}-${name}`}
          name={name}
          aria-label={label}
          type={type}
          value={values[name]}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore="true"
          required
          maxLength={
            name === "email"
              ? 254
              : name === "name"
                ? 100
                : name === "code"
                  ? 6
                  : 128
          }
          inputMode={
            name === "code" ? "numeric" : name === "email" ? "email" : undefined
          }
          disabled={!hydrated || busy || success}
          aria-invalid={!!visible && !!problem}
          aria-describedby={`${id}-${name}-help`}
          onBlur={() => setTouched((current) => ({ ...current, [name]: true }))}
          onChange={(event) => {
            setValues((current) => ({
              ...current,
              [name]: event.target.value,
            }));
            if (["password", "name", "email"].includes(name)) setScore(null);
            setMessage("");
          }}
        />
        <small
          id={`${id}-${name}-help`}
          className={visible && !problem ? styles.valid : styles.feedback}
          aria-live="polite"
        >
          {visible
            ? problem ||
              (name === "email" ? "Email format looks valid." : "✓ Looks good")
            : name === "password" && newPassword
              ? "15+ characters; choose an uncommon, unique passphrase."
              : name === "code"
                ? "Your email contains the secure link and verification code."
                : " "}
        </small>
      </label>
    );
  }
  return (
    <>
      <form
        className={styles.form}
        onSubmit={submit}
        noValidate
        autoComplete="off"
        aria-busy={busy}
        aria-label={labels[mode]}
      >
        {mode === "register" && field("name", "Full name")}
        {mode !== "reset-password" && field("email", "Email address", "email")}
        {mode === "reset-password" && field("code", "Verification code")}
        {mode !== "forgot-password" &&
          field(
            "password",
            newPassword ? "New password" : "Password",
            "password",
          )}
        {newPassword && (
          <>
            <div className={styles.strength} role="status" aria-live="polite">
              <div className={styles.meter} aria-hidden="true">
                {[1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    data-filled={score !== null && score >= level}
                  />
                ))}
              </div>
              <small>
                {!values.password
                  ? "Password strength"
                  : score === null
                    ? "Checking password…"
                    : [
                        "Very predictable",
                        "Weak",
                        "Needs improvement",
                        "Strong",
                        "Very strong",
                      ][score]}
              </small>
            </div>
            {field("confirmPassword", "Confirm password", "password")}
          </>
        )}
        {mode === "login" && (
          <Link className={styles.subtleLink} href={authRoutes.forgot}>
            Forgot password?
          </Link>
        )}
        <Button type="submit" disabled={!hydrated || busy || success}>
          {busy ? "Please wait…" : labels[mode]}
        </Button>
        {message && (
          <p
            className={success ? styles.success : styles.error}
            role={success ? "status" : "alert"}
          >
            {message}
          </p>
        )}
      </form>
      <p className={styles.switchLink}>
        {mode === "login" ? (
          <>
            New here? <Link href={authRoutes.register}>Create an account</Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={authRoutes.login}>Sign in</Link>
          </>
        )}
      </p>
      {mode === "reset-password" && (
        <p className={styles.switchLink}>
          <Link href={authRoutes.forgot}>Request another reset link</Link>
        </p>
      )}
    </>
  );
}
