import { NextRequest, NextResponse } from "next/server";

const actions = new Set([
  "register",
  "login",
  "forgot-password",
  "reset-password",
  "session",
  "logout",
  "activity",
  "dashboard",
  "inbox",
  "users",
]);
const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Host-sammy_session"
    : "sammy_session";

function failure(message: string, status: number, clearSession = false) {
  const response = NextResponse.json(
    { success: false, message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
  if (clearSession)
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  return response;
}

async function handle(
  request: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  const { action } = await context.params;
  if (!actions.has(action)) return failure("Endpoint not found.", 404);
  if (
    request.method !==
    (["session", "dashboard", "inbox", "users"].includes(action)
      ? "GET"
      : "POST")
  ) {
    return failure("Unsupported request method.", 405);
  }
  if (request.method === "POST") {
    if (request.headers.get("origin") !== request.nextUrl.origin) {
      return failure("Please submit this form from this website.", 403);
    }
    if (!request.headers.get("content-type")?.startsWith("application/json")) {
      return failure("Submit JSON data.", 415);
    }
  }
  const serverUrl = process.env.CONTACT_SERVER_URL;
  const apiKey = process.env.CONTACT_API_KEY;
  if (!serverUrl || !apiKey)
    return failure(
      "Account services are temporarily unavailable.",
      503,
      action === "logout",
    );
  try {
    let body: string | undefined;
    if (request.method === "POST") {
      const reader = request.body?.getReader();
      if (!reader) return failure("Submit a valid form.", 400);
      const chunks: Uint8Array[] = [];
      let length = 0;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 16_384) {
            await reader.cancel();
            return failure("Request is too large.", 413);
          }
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      const bytes = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      body = new TextDecoder().decode(bytes);
    }
    const endpoint = new URL(`/api/auth/${action}`, serverUrl);
    if (["inbox", "users"].includes(action)) {
      for (const key of ["page", "search"]) {
        const value = request.nextUrl.searchParams.get(key);
        if (value !== null) endpoint.searchParams.set(key, value);
      }
    }
    if (
      process.env.NODE_ENV === "production" &&
      endpoint.protocol !== "https:"
    ) {
      return failure("Account services are temporarily unavailable.", 503);
    }
    const upstream = await fetch(endpoint, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Contact-API-Key": apiKey,
        "X-Auth-Session": request.cookies.get(cookieName)?.value ?? "",
        "X-Auth-Client": process.env.VERCEL
          ? (request.headers.get("x-vercel-forwarded-for") ?? "unknown")
          : "local-development",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    const result: unknown = await upstream.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("success" in result) ||
      typeof result.success !== "boolean"
    ) {
      return failure("Account services are temporarily unavailable.", 503);
    }
    const data = result as Record<string, unknown>;
    const session = data.session_token;
    delete data.session_token;
    const response = NextResponse.json(data, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
    if (action === "login" && upstream.ok && data.success === true) {
      if (typeof session !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(session)) {
        return failure(
          "Sign in could not be completed. Please try again.",
          502,
        );
      }
      response.cookies.set(cookieName, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 28_800,
      });
    }
    if (
      action === "logout" ||
      (["session", "dashboard", "activity", "inbox", "users"].includes(
        action,
      ) &&
        upstream.status === 401) ||
      (action === "reset-password" && upstream.ok)
    ) {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
    }
    return response;
  } catch {
    return failure(
      "Account services are temporarily unavailable. Please try again later.",
      503,
      action === "logout",
    );
  }
}

export const GET = handle;
export const POST = handle;
