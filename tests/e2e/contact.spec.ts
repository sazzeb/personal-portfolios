import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000" });

test("confirmed contact success clears the form and opens a dismissible popup", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      json: {
        success: true,
        message: "Your thought has been sent, Eko Samuel will reach out to you",
      },
    }),
  );
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Project enquiry" });
  await form.getByLabel("Your Name", { exact: true }).fill("Contact test");
  await form.getByLabel("Your Email", { exact: true }).fill("test@example.com");
  await form
    .getByLabel("Your Message", { exact: true })
    .fill("A test enquiry.");
  await form.getByRole("button", { name: "What's On Your Mind" }).click();
  const dialog = page.getByRole("dialog", { name: "Congratulations!" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Your thought has been sent");
  await expect(form.getByLabel("Your Name", { exact: true })).toHaveValue("");
  await expect(form.getByLabel("Your Message", { exact: true })).toHaveValue(
    "",
  );
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).not.toBeVisible();
});

test("failed forwarding preserves the message and never shows congratulations", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      json: {
        success: false,
        message: "Your message could not be sent. Please try again later.",
      },
    }),
  );
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Project enquiry" });
  await form.getByLabel("Your Name", { exact: true }).fill("Contact test");
  await form.getByLabel("Your Email", { exact: true }).fill("test@example.com");
  await form
    .getByLabel("Your Message", { exact: true })
    .fill("Please preserve this enquiry.");
  await form.getByRole("button", { name: "What's On Your Mind" }).click();
  await expect(form.getByRole("alert")).toContainText("could not be sent");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(form.getByLabel("Your Message", { exact: true })).toHaveValue(
    "Please preserve this enquiry.",
  );
});
