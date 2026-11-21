import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

test("private workspace rejects missing and forged sessions", async ({
  page,
  context,
}) => {
  await page.goto("/protected/admin");
  await expect(page).toHaveURL(/\/protected\/login/, { timeout: 20_000 });
  await context.addCookies([
    {
      name: "sammy_session",
      value: "a".repeat(43),
      url: "http://localhost:3000",
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);
  await page.goto("/protected/admin");
  await expect(page).toHaveURL(/\/protected\/login/, { timeout: 20_000 });
  await expect(page.locator("[data-admin-workspace]")).toHaveCount(0);
});

test("workspace renders real account data, renews on confirmation, and signs out at expiry", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    process.env.RUN_AUTH_INTEGRATION !== "1",
    "Opt-in: requires configured Neon database",
  );
  test.setTimeout(120_000);
  const email = `workspace-e2e-${randomUUID().replaceAll("-", "")}@example.com`;
  const password = `Velvet! orbital canoe ${randomUUID()}`;
  try {
    const registration = await request.post("/api/auth/register", {
      headers: { Origin: "http://localhost:3000" },
      data: {
        name: "Workspace Test",
        email,
        password,
        confirmPassword: password,
      },
    });
    expect(registration.status()).toBe(200);
    await page.goto("/protected/login");
    const form = page.getByRole("form", { name: "Sign in" });
    await form.getByLabel("Email address").fill(email);
    await form.getByLabel("Password", { exact: true }).fill(password);
    await form.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/protected\/admin$/, { timeout: 20_000 });
    await expect(
      page.getByRole("heading", { name: "Workspace overview" }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("workspace.png"),
      fullPage: true,
    });
    const cookies = await page.context().cookies();
    const session = cookies.find((cookie) => cookie.name === "sammy_session");
    expect(session?.httpOnly).toBe(true);
    expect(session?.sameSite).toBe("Strict");
    expect(
      await page.evaluate(() => document.cookie.includes("sammy_session")),
    ).toBe(false);
    await page.getByLabel("Search projects").fill("tennis");
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await page
      .getByRole("button", { name: "View account and security" })
      .click();
    await expect(page.getByText(email, { exact: true })).toBeVisible();
    const sessionResponse = await page.request.get("/api/auth/session");
    const current = await sessionResponse.json();
    expect(current.session.idle_timeout_seconds).toBe(900);
    expect(current.session.absolute_timeout_seconds).toBe(28800);
    await page.clock.install();
    let seconds = 90;
    await page.route("**/api/auth/session", (route) =>
      route.fulfill({
        json: {
          ...current,
          session: { ...current.session, idle_seconds_remaining: seconds },
        },
      }),
    );
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Stay signed in" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    seconds = 1;
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.clock.fastForward(2100);
    await expect(page).toHaveURL(/\/protected\/login\?reason=expired/, {
      timeout: 20_000,
    });
    await page.unroute("**/api/auth/session");
    expect((await page.request.get("/api/auth/session")).status()).toBe(401);
    await page.goto("/protected/admin");
    await expect(page).toHaveURL(/\/protected\/login/);
  } finally {
    execFileSync(
      ".venv/bin/python",
      ["-m", "server.tests.cleanup_browser_user", email],
      { cwd: process.cwd(), stdio: "pipe" },
    );
  }
});

test("administrator can search the contact inbox, read messages safely, and list registered users", async ({
  page,
  request,
}) => {
  test.skip(
    process.env.RUN_AUTH_INTEGRATION !== "1",
    "Opt-in: requires configured Neon database",
  );
  test.setTimeout(120_000);
  const email = `workspace-e2e-${randomUUID().replaceAll("-", "")}@example.com`;
  const password = `Velvet! orbital canoe ${randomUUID()}`;
  try {
    const registered = await request.post("/api/auth/register", {
      headers: { Origin: "http://localhost:3000" },
      data: {
        name: "Inbox Administrator",
        email,
        password,
        confirmPassword: password,
      },
    });
    expect(registered.status()).toBe(200);
    execFileSync(
      ".venv/bin/python",
      ["-m", "server.tests.cleanup_browser_user", email, "seed-admin"],
      { stdio: "pipe" },
    );
    await page.goto("/protected/login");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Workspace overview" }),
    ).toBeVisible({ timeout: 20_000 });
    const navigate = async (name: string) => {
      if ((page.viewportSize()?.width ?? 1440) < 980)
        await page
          .getByRole("button", { name: "Open workspace navigation" })
          .click();
      await page.getByRole("button", { name, exact: true }).click();
    };
    await navigate("Inbox");
    const inbox = page.getByRole("region", { name: "Contact messages" });
    await inbox.getByLabel("Search contact messages").fill(email);
    await inbox.getByRole("button", { name: "Search", exact: true }).click();
    await expect(inbox.getByText(email, { exact: true })).toBeVisible({
      timeout: 20_000,
    });
    await expect(inbox.locator("tbody tr")).toHaveCount(1, { timeout: 20_000 });
    await inbox
      .getByRole("button", { name: "Read message from Workspace Inbox Test" })
      .click();
    const message = page.getByRole("dialog");
    await expect(
      message.getByRole("heading", { name: "Workspace inbox verification" }),
    ).toBeVisible();
    await expect(message).toContainText(
      "<script>window.__inboxExecuted=true</script>",
    );
    expect(await page.evaluate(() => "__inboxExecuted" in window)).toBe(false);
    await expect(
      message.getByRole("link", { name: "Reply by email" }),
    ).toHaveAttribute("href", /^mailto:/);
    await message.getByRole("button", { name: "Close message" }).click();
    await navigate("Users");
    const users = page.getByRole("region", { name: "User directory" });
    await users.getByLabel("Search users").fill(email);
    await users.getByRole("button", { name: "Search", exact: true }).click();
    await expect(users.getByText(email, { exact: true })).toBeVisible({
      timeout: 20_000,
    });
    await expect(users.locator("tbody tr")).toHaveCount(1, { timeout: 20_000 });
    await expect(
      users.getByText("Administrator", { exact: true }),
    ).toBeVisible();
    await expect(users.getByText(/password_hash|token_hash/)).toHaveCount(0);
  } finally {
    execFileSync(
      ".venv/bin/python",
      ["-m", "server.tests.cleanup_browser_user", email],
      { stdio: "pipe" },
    );
  }
});
