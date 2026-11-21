import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

test("registration catches mismatched passwords without submitting", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/auth/register", (route) => {
    requests += 1;
    return route.abort();
  });
  await page.goto("/protected/register");
  const form = page.getByRole("form", { name: "Create account" });
  await form.getByLabel("Full name").fill("Test user");
  await form.getByLabel("Email address").fill("test@example.com");
  await form
    .getByLabel("New password", { exact: true })
    .fill("Velvet! orbital canoe 92 quartz");
  await form
    .getByLabel("Confirm password")
    .fill("Different quartz canoe 92 orbit!");
  await form.getByRole("button", { name: "Create account" }).click();
  await expect(form.getByRole("alert")).toContainText("do not match");
  expect(requests).toBe(0);
});

test("login preserves fields and displays a rejected-credentials error", async ({
  page,
}) => {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      status: 401,
      json: { success: false, message: "Email or password is incorrect." },
    }),
  );
  await page.goto("/protected/login");
  const form = page.getByRole("form", { name: "Sign in" });
  await form.getByLabel("Email address").fill("test@example.com");
  await form
    .getByLabel("Password", { exact: true })
    .fill("Incorrect passphrase");
  await form.getByRole("button", { name: "Sign in" }).click();
  await expect(form.getByRole("alert")).toContainText(
    "Email or password is incorrect",
  );
  await expect(form.getByLabel("Email address")).toHaveValue(
    "test@example.com",
  );
});

test("password reset requires the email token", async ({ page }) => {
  await page.goto("/protected/reset-password");
  const form = page.getByRole("form", { name: "Update password" });
  await form
    .getByLabel("New password", { exact: true })
    .fill("New secure passphrase");
  await form.getByLabel("Confirm password").fill("New secure passphrase");
  await form.getByRole("button", { name: "Update password" }).click();
  await expect(form.getByRole("alert")).toContainText("reset link is invalid");
});

test("portfolio navigation does not advertise account pages", async ({
  page,
}) => {
  await page.goto("/");
  for (const href of [
    "/protected/login",
    "/protected/register",
    "/protected/forgot-password",
    "/protected/account",
  ]) {
    await expect(
      page.locator(`header a[href="${href}"], footer a[href="${href}"]`),
    ).toHaveCount(0);
  }
});

test("auth proxy rejects cross-origin mutations", async ({ request }) => {
  const response = await request.post("/api/auth/login", {
    headers: { Origin: "https://other-site.example" },
    data: { email: "test@example.com", password: "Test password" },
  });
  expect(response.status()).toBe(403);
});

test("registration gives live validation and rejects common passwords", async ({
  page,
}) => {
  let sent = 0;
  await page.route("**/api/auth/register", (route) => {
    sent++;
    return route.abort();
  });
  await page.goto("/protected/register");
  const form = page.getByRole("form", { name: "Create account" });
  await form.getByLabel("Full name").fill("123");
  await expect(form.getByLabel("Full name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await form.getByLabel("Full name").fill("José O’Neil");
  await expect(form.getByLabel("Full name")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await form.getByLabel("Email address").fill("bad..email@example.com");
  await expect(form.getByLabel("Email address")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await form.getByLabel("Email address").fill("person+test@example.com");
  await form
    .getByLabel("New password", { exact: true })
    .fill("Password123456789!");
  await form.getByLabel("Confirm password").fill("Password123456789!");
  await form.getByRole("button", { name: "Create account" }).click();
  await expect(form.getByRole("alert")).toContainText("common passwords");
  expect(sent).toBe(0);
  for (const input of await form.locator("input").all())
    await expect(input).toHaveAttribute("autocomplete", "off");
});

test("reset sends code, link token and matching passwords and removes token on success", async ({
  page,
}) => {
  let payload: Record<string, string> = {};
  await page.route("**/api/auth/reset-password", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      json: {
        success: true,
        message: "Your password has been updated. Please sign in again.",
      },
    });
  });
  const token = "a".repeat(43);
  await page.goto(`/protected/reset-password#token=${token}`);
  const form = page.getByRole("form", { name: "Update password" });
  await form.getByLabel("Verification code").fill("123");
  await expect(form.getByLabel("Verification code")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await form.getByLabel("Verification code").fill("123456");
  const password = "Velvet! orbital canoe 92 quartz";
  await form.getByLabel("New password", { exact: true }).fill(password);
  await form.getByLabel("Confirm password").fill(password);
  await form.getByRole("button", { name: "Update password" }).click();
  await expect(page).toHaveURL(/\/protected\/login$/);
  expect(payload).toMatchObject({
    token,
    code: "123456",
    password,
    confirmPassword: password,
  });
  await expect(page.getByRole("form", { name: "Sign in" })).toBeVisible();
});

test("successful registration redirects directly to login", async ({
  page,
}) => {
  await page.route("**/api/auth/register", (route) =>
    route.fulfill({
      json: { success: true, message: "Your account has been created." },
    }),
  );
  await page.goto("/protected/register");
  const form = page.getByRole("form", { name: "Create account" });
  await form.getByLabel("Full name").fill("Test User");
  await form.getByLabel("Email address").fill("person@example.com");
  const password = "Velvet! orbital canoe 92 quartz";
  await form.getByLabel("New password", { exact: true }).fill(password);
  await form.getByLabel("Confirm password").fill(password);
  await form.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/protected\/login$/);
  await expect(page.getByRole("form", { name: "Sign in" })).toBeVisible();
});

test("forgot password displays private delivery confirmation", async ({
  page,
}) => {
  await page.route("**/api/auth/forgot-password", (route) =>
    route.fulfill({
      json: {
        success: true,
        message:
          "If an account exists for that email, a password reset link will be sent.",
      },
    }),
  );
  await page.goto("/protected/forgot-password");
  await page.getByLabel("Email address").fill("person@example.com");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "If an account exists" }),
  ).toBeVisible();
});

test("old public account URLs no longer expose forms", async ({ page }) => {
  for (const path of [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/account",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: /404|not found/i }).first(),
    ).toBeVisible();
  }
});
