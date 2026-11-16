"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import styles from "./contact-form.module.scss";

const fields = [
  {
    name: "name",
    label: "Your Name",
    type: "text",
    autoComplete: "name",
    required: true,
  },
  {
    name: "email",
    label: "Your Email",
    type: "email",
    autoComplete: "email",
    required: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    autoComplete: "off",
    required: false,
  },
] as const;

interface ContactFormProps {
  compact?: boolean;
}

export function ContactForm({ compact = false }: ContactFormProps) {
  const formId = useId();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [received, setReceived] = useState(false);
  const [hasError, setHasError] = useState(false);
  const pending = useRef<{ payload: string; identifier: string } | null>(null);
  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || received) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = JSON.stringify({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    });
    inFlight.current = true;
    setSubmitting(true);
    setHasError(false);
    setStatus("");
    try {
      if (pending.current?.payload !== payload) {
        pending.current = { payload, identifier: crypto.randomUUID() };
      }
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": pending.current.identifier,
        },
        body: payload,
        signal: AbortSignal.timeout(45_000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        if (result.code === "forwarded_not_stored") setReceived(true);
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Your message could not be sent. Please try again later.",
        );
      }
      form.reset();
      pending.current = null;
      setStatus("Your thought has been sent, Eko Samuel will reach out to you");
    } catch (error) {
      setHasError(true);
      setStatus(
        error instanceof Error &&
          error.name !== "TimeoutError" &&
          error.name !== "TypeError"
          ? error.message
          : "We could not confirm your submission. Please try again shortly.",
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      className={classNames(styles.form, compact && styles.compact)}
      onSubmit={handleSubmit}
      aria-label={compact ? "Chat enquiry" : "Project enquiry"}
      aria-busy={submitting}
    >
      {fields
        .filter(({ name }) => !compact || name === "name" || name === "email")
        .map(({ name, label, type, autoComplete, required }) => (
          <div className={styles.field} key={name}>
            <label className="sr-only" htmlFor={`${formId}-${name}`}>
              {label}
            </label>
            <input
              id={`${formId}-${name}`}
              name={name}
              placeholder={label}
              type={type}
              autoComplete={autoComplete}
              required={required}
              disabled={submitting || received}
              maxLength={200}
            />
          </div>
        ))}
      <div className={styles.message}>
        <label className="sr-only" htmlFor={`${formId}-message`}>
          Your Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          placeholder="Your Message"
          required
          disabled={submitting || received}
          maxLength={5000}
          rows={5}
        />
      </div>
      <Button
        type="submit"
        className={styles.submit}
        disabled={submitting || received}
      >
        {submitting
          ? "Sending…"
          : compact
            ? "Send Message"
            : "What's On Your Mind"}
      </Button>
      <p className={styles.status} role={hasError ? "alert" : "status"}>
        {status}
      </p>
    </form>
  );
}
