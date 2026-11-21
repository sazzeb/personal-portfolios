"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SessionTiming } from "@/lib/admin-types";

/** Checks do not renew sessions. Only visible, deliberate activity sends a renewal. */
export function useSecureSession(initial: SessionTiming) {
  const [remaining, setRemaining] = useState(
    Math.min(
      initial.idle_seconds_remaining,
      initial.absolute_seconds_remaining,
    ),
  );
  const [warning, setWarning] = useState(false),
    [issue, setIssue] = useState("");
  const state = useRef({
    idle: 0,
    absolute: 0,
    lastSent: 0,
    pending: false,
    ended: false,
  });
  const channel = useRef<BroadcastChannel | null>(null);
  const accept = useCallback((session: SessionTiming) => {
    const now = Date.now();
    state.current.idle = now + session.idle_seconds_remaining * 1000;
    state.current.absolute = now + session.absolute_seconds_remaining * 1000;
    setRemaining(
      Math.min(
        session.idle_seconds_remaining,
        session.absolute_seconds_remaining,
      ),
    );
    setWarning(
      Math.min(
        session.idle_seconds_remaining,
        session.absolute_seconds_remaining,
      ) <= 120,
    );
  }, []);
  const logout = useCallback(
    async (reason = "signed-out", broadcast = true) => {
      if (state.current.ended) return;
      state.current.ended = true;
      if (broadcast) channel.current?.postMessage({ type: "logout" });
      // Hide content before the network call; hard navigation clears the client route cache.
      document.documentElement.dataset.sessionLocked = "true";
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          signal: AbortSignal.timeout(5000),
        });
      } catch {}
      window.location.replace(`/protected/login?reason=${reason}`);
    },
    [],
  );
  const check = useCallback(
    async (touch = false) => {
      if (state.current.pending || state.current.ended) return;
      if (Date.now() >= Math.min(state.current.idle, state.current.absolute)) {
        void logout("expired");
        return;
      }
      state.current.pending = true;
      try {
        const response = await fetch(
          `/api/auth/${touch ? "activity" : "session"}`,
          {
            method: touch ? "POST" : "GET",
            headers: { "Content-Type": "application/json" },
            ...(touch ? { body: "{}" } : {}),
            cache: "no-store",
            signal: AbortSignal.timeout(10_000),
          },
        );
        if (response.status === 401) {
          void logout("expired");
          return;
        }
        const data = await response.json();
        if (!response.ok || data.success !== true || !data.session)
          throw new Error("Session verification unavailable");
        accept(data.session);
        setIssue("");
        if (touch) state.current.lastSent = Date.now();
      } catch {
        setIssue(
          "Connection interrupted. Session expiry remains active. Retry to verify access.",
        );
      } finally {
        state.current.pending = false;
      }
    },
    [accept, logout],
  );
  useEffect(() => {
    delete document.documentElement.dataset.sessionLocked;
    const now = Date.now();
    state.current.idle = now + initial.idle_seconds_remaining * 1000;
    state.current.absolute = now + initial.absolute_seconds_remaining * 1000;
    state.current.lastSent = Date.now();
    if (typeof BroadcastChannel !== "undefined") {
      channel.current = new BroadcastChannel("eko-workspace-session");
      channel.current.onmessage = (event) => {
        if (event.data?.type === "logout") void logout("signed-out", false);
      };
    }
    const timer = setInterval(() => {
      const seconds = Math.max(
        0,
        Math.ceil(
          (Math.min(state.current.idle, state.current.absolute) - Date.now()) /
            1000,
        ),
      );
      setRemaining(seconds);
      setWarning(seconds <= 120);
      if (seconds === 0) void logout("expired");
    }, 1000);
    const verification = setInterval(() => {
      if (document.visibilityState === "visible") void check();
    }, 60_000);
    const activity = (event: Event) => {
      if (!event.isTrusted || document.visibilityState !== "visible") return;
      // The warning requires the explicit Stay signed in button.
      if (
        Date.now() >=
        Math.min(state.current.idle, state.current.absolute) - 120000
      )
        return;
      if (Date.now() - state.current.lastSent >= 60000) void check(true);
    };
    const revalidate = () => {
      if (document.visibilityState === "visible") void check();
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) void check();
    };
    for (const name of ["pointerdown", "keydown", "scroll"])
      window.addEventListener(name, activity, { passive: true });
    document.addEventListener("visibilitychange", revalidate);
    window.addEventListener("focus", revalidate);
    window.addEventListener("pageshow", restore);
    return () => {
      clearInterval(timer);
      clearInterval(verification);
      for (const name of ["pointerdown", "keydown", "scroll"])
        window.removeEventListener(name, activity);
      document.removeEventListener("visibilitychange", revalidate);
      window.removeEventListener("focus", revalidate);
      window.removeEventListener("pageshow", restore);
      channel.current?.close();
    };
  }, [initial, accept, check, logout]);
  return {
    remaining,
    warning,
    issue,
    logout,
    continueSession: () => check(true),
    verify: () => check(),
  };
}
