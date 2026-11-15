"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { createEmailDraft } from "@/lib/contact";
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    window.location.href = createEmailDraft(formData);
    setStatus(
      "Your email app will open with your message. Send it there to complete your request.",
    );
  }

  return (
    <form
      className={classNames(styles.form, compact && styles.compact)}
      onSubmit={handleSubmit}
      aria-label={compact ? "Chat enquiry" : "Project enquiry"}
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
          maxLength={5000}
          rows={5}
        />
      </div>
      <Button type="submit" className={styles.submit}>
        {compact ? "Send Message" : "What's On Your Mind"}
      </Button>
      <p className={styles.status} role="status">
        {status}
      </p>
    </form>
  );
}
