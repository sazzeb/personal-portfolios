"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { sammy } from "@/config/sammy";
import styles from "./site-footer.module.scss";

export function NewsletterForm() {
  const [status, setStatus] = useState("");

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    const query = new URLSearchParams({
      subject: "Newsletter subscription request",
      body: `Please send portfolio updates to ${email}.`,
    });
    window.location.href = `mailto:${sammy.contact.email}?${query}`;
    setStatus("Your email app will open with your subscription request.");
  }

  return (
    <>
      <form className={styles.newsletter} onSubmit={handleSubscribe}>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email Adress"
          required
        />
        <button type="submit" aria-label="Request newsletter updates">
          <Mail size={19} />
        </button>
      </form>
      <p className={styles.newsletterStatus} role="status">
        {status}
      </p>
    </>
  );
}
