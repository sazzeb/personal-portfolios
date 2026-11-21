import { expect, test } from "@playwright/test";

test("hero rotates engineering roles with the original animation", async ({
  page,
}) => {
  await page.goto("/");
  const role = page.locator("h1 [data-collapsed]");
  await expect(role).toHaveText("AI (Machine Learning) Engineer");
  await expect(role).toHaveText("Senior Software Engineer", { timeout: 6000 });
  await expect(role).toHaveAttribute("data-collapsed", "false");
  await expect(role).toHaveText("Full-Stack Engineer", { timeout: 6000 });
  await expect(role).toHaveText("Cloud Engineer", { timeout: 6000 });
});

test("skill bars reveal and finish animating when scrolled into view", async ({
  page,
}) => {
  await page.goto("/");
  const bar = page.getByText("Machine Learning", { exact: true }).locator("..");
  await bar.evaluate((element) =>
    element.scrollIntoView({ behavior: "instant", block: "center" }),
  );
  const fill = bar.locator("[data-progress]");
  await expect(fill).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
});

test("homepage loads without runtime errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Eko Samuel — Personal Portfolio");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(6, 6, 6)",
  );
  await expect(page.locator("body")).not.toContainText(/Reeni|Jane Cooper/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Eko Samuel",
  );
  const portrait = page
    .getByRole("region", { name: "Introduction", exact: true })
    .getByRole("img", { name: /Eko Samuel/ });
  await expect(portrait).toBeVisible();
  await expect
    .poll(() =>
      portrait.evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test("menu traps focus, closes with Escape, and restores its trigger", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("portfolio links open the corresponding project", async ({ page }) => {
  await page.goto("/projects");
  await page
    .getByRole("link", {
      name: "View ZandaTax (EnrolledAgent.com)",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/projects\/zandatax$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Project Details",
  );
  await expect(
    page.getByRole("heading", {
      name: "ZandaTax (EnrolledAgent.com)",
      exact: true,
    }),
  ).toBeVisible();
});

test("testimonials support keyboard navigation", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByLabel("Professional highlights carousel", {
    exact: true,
  });
  await carousel.scrollIntoViewIfNeeded();
  await carousel.focus();
  const activeQuote = page.locator(
    ".swiper-slide-active [data-highlight-statement]",
  );
  const before = await activeQuote.textContent();
  await page.keyboard.press("ArrowRight");
  await expect(activeQuote).not.toHaveText(before ?? "");
});

test("contact fields validate required content and email format", async ({
  page,
}) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Project enquiry", exact: true });
  await expect(form.getByLabel("Your Name", { exact: true })).toBeEnabled();
  expect(
    await form.evaluate((element: HTMLFormElement) => element.checkValidity()),
  ).toBe(false);
  await form.getByLabel("Your Name", { exact: true }).fill("Alex Designer");
  await form.getByLabel("Your Email", { exact: true }).fill("invalid-address");
  await form
    .getByLabel("Your Message", { exact: true })
    .fill("I would like to discuss a design project.");
  expect(
    await form.evaluate((element: HTMLFormElement) => element.checkValidity()),
  ).toBe(false);
  await form.getByLabel("Your Email", { exact: true }).fill("alex@example.com");
  expect(
    await form.evaluate((element: HTMLFormElement) => element.checkValidity()),
  ).toBe(true);
});

test("reduced motion preserves visible content and a static hero role", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading.locator("[data-collapsed]")).toHaveText(
    "AI (Machine Learning) Engineer",
  );
  expect(
    await page.evaluate(() => document.documentElement.dataset.motion),
  ).not.toBe("enabled");
  await expect(
    page
      .getByRole("heading", {
        name: "AI (Machine Learning) Engineer",
        exact: true,
      })
      .first(),
  ).toBeVisible();
});

test("chat opens a separate labelled form and closes with Escape", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open chat", exact: true }).click();
  await expect(
    page.getByRole("form", { name: "Chat enquiry", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("form", { name: "Chat enquiry", exact: true }),
  ).toHaveCount(0);
});
