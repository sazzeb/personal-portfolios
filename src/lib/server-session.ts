import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DashboardData } from "./admin-types";

export async function requireDashboard(): Promise<DashboardData | null> {
  const store = await cookies();
  const name =
    process.env.NODE_ENV === "production"
      ? "__Host-sammy_session"
      : "sammy_session";
  const token = store.get(name)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token))
    redirect("/protected/login");
  const origin = process.env.CONTACT_SERVER_URL,
    key = process.env.CONTACT_API_KEY;
  if (!origin || !key) return null;
  let response: Response;
  try {
    const endpoint = new URL("/api/auth/dashboard", origin);
    if (process.env.NODE_ENV === "production" && endpoint.protocol !== "https:")
      return null;
    response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        "X-Contact-API-Key": key,
        "X-Auth-Session": token,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return null;
  }
  if (response.status === 401) redirect("/protected/login?reason=expired");
  if (!response.ok) return null;
  try {
    const data = await response.json();
    if (
      data.success !== true ||
      typeof data.user?.id !== "string" ||
      typeof data.user?.name !== "string" ||
      typeof data.user?.email !== "string" ||
      !Number.isInteger(data.active_sessions) ||
      ![
        data.session?.idle_seconds_remaining,
        data.session?.absolute_seconds_remaining,
      ].every((value) => typeof value === "number" && Number.isFinite(value))
    )
      return null;
    return {
      user: data.user,
      session: data.session,
      active_sessions: data.active_sessions,
    };
  } catch {
    return null;
  }
}
