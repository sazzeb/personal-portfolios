import { expect, test } from "@playwright/test";
import { NextRequest } from "next/server";
import { POST } from "../../src/app/api/auth/[action]/route";

test("sign-out clears the browser cookie when the backend cannot be reached", async () => {
  const previousFetch = globalThis.fetch;
  const previousUrl = process.env.CONTACT_SERVER_URL;
  const previousKey = process.env.CONTACT_API_KEY;
  try {
    process.env.CONTACT_SERVER_URL = "http://127.0.0.1:8000";
    process.env.CONTACT_API_KEY = "isolated-test-secret";
    globalThis.fetch = async () => {
      throw new Error("Simulated offline backend");
    };
    const request = new NextRequest("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
        Cookie: `sammy_session=${"a".repeat(43)}`,
      },
      body: "{}",
    });
    const response = await POST(request, {
      params: Promise.resolve({ action: "logout" }),
    });
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("cache-control")).toBe("no-store");
  } finally {
    globalThis.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.CONTACT_SERVER_URL;
    else process.env.CONTACT_SERVER_URL = previousUrl;
    if (previousKey === undefined) delete process.env.CONTACT_API_KEY;
    else process.env.CONTACT_API_KEY = previousKey;
  }
});
