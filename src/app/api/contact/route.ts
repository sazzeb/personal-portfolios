const MAX_BODY_BYTES = 32_768;

function unavailable() {
  return Response.json(
    {
      success: false,
      message:
        "The contact service is temporarily unavailable. Please try again later.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const serverUrl = process.env.CONTACT_SERVER_URL;
  const apiKey = process.env.CONTACT_API_KEY;
  if (!serverUrl || !apiKey) return unavailable();

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json(
      { success: false, message: "Please submit the form from this website." },
      { status: 403 },
    );
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json(
      { success: false, message: "Submit the contact form as JSON." },
      { status: 415 },
    );
  }
  const identifier = request.headers.get("idempotency-key") ?? "";
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      identifier,
    )
  ) {
    return Response.json(
      { success: false, message: "Please refresh the page and try again." },
      { status: 400 },
    );
  }
  if (!request.body) {
    return Response.json(
      { success: false, message: "Please fill in the contact form." },
      { status: 400 },
    );
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return Response.json(
          { success: false, message: "Your message is too large." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const endpoint = new URL("/api/contact", serverUrl);
    if (process.env.NODE_ENV === "production" && endpoint.protocol !== "https:")
      return unavailable();
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Contact-API-Key": apiKey,
        "Idempotency-Key": identifier,
      },
      body: new TextDecoder().decode(bytes),
      cache: "no-store",
      signal: AbortSignal.timeout(40_000),
    });
    const result: unknown = await upstream.json();
    if (
      typeof result !== "object" ||
      result === null ||
      !("success" in result) ||
      typeof result.success !== "boolean" ||
      !("message" in result) ||
      typeof result.message !== "string"
    )
      return unavailable();
    if (upstream.status === 401 || upstream.status === 403)
      return unavailable();
    return Response.json(result, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return unavailable();
  } finally {
    reader.releaseLock();
  }
}
