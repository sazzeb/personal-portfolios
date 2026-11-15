"use client";

import { ArrowUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollThreshold } from "@/hooks/use-scroll-threshold";
import { ContactForm } from "@/components/contact/contact-form";
import styles from "./floating-tools.module.scss";

export function FloatingTools() {
  const [chatOpen, setChatOpen] = useState(false);
  const showScrollTop = useScrollThreshold(300);
  const progressRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      const remaining =
        document.documentElement.scrollHeight - window.innerHeight;
      const percentage = remaining > 0 ? window.scrollY / remaining : 0;
      progressRef.current?.style.setProperty(
        "--scroll-progress",
        `${percentage * 360}deg`,
      );
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [chatOpen]);

  return (
    <>
      {chatOpen ? (
        <section
          className={styles.chat}
          id="chat-panel"
          aria-label="Chat enquiry"
        >
          <div className={styles.chatHeading}>
            <h2>Let&apos;s chat with me? - Online</h2>
            <button onClick={() => setChatOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className={styles.chatBody}>
            <p>
              Please fill out the form below to start chatting with me directly.
            </p>
            <ContactForm compact />
          </div>
        </section>
      ) : null}
      <button
        className={styles.chatButton}
        onClick={() => setChatOpen((previous) => !previous)}
        aria-label={chatOpen ? "Close chat" : "Open chat"}
        aria-expanded={chatOpen}
        aria-controls="chat-panel"
      >
        {chatOpen ? (
          <X size={23} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="white"
              d="M12 2C6.5 2 2 6.2 2 11.5c0 3 1.4 5.7 3.7 7.5V22l3.5-1.9c.9.3 1.8.4 2.8.4 5.5 0 10-4.2 10-9.5S17.5 2 12 2Z"
            />
            <path fill="var(--color-primary)" d="m6 14 5-5 3 2 4-2-5 5-3-2-4 2Z" />
          </svg>
        )}
      </button>
      <button
        ref={progressRef}
        className={styles.scrollTop}
        data-visible={showScrollTop}
        aria-label="Back to top"
        tabIndex={showScrollTop ? 0 : -1}
        onClick={() => {
          const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
        }}
      >
        <ArrowUp size={22} />
      </button>
    </>
  );
}
