import { expect, test } from "@playwright/test";
import { createEmailDraft } from "../../src/lib/contact";

test("all navigation destinations resolve, including invalid slugs", async ({
  request,
  page,
}) => {
  const routes = [
    "/",
    "/about",
    "/services",
    "/services/web-design",
    "/services/ui-ux-design",
    "/services/web-research",
    "/services/marketing",
    "/projects",
    "/projects?layout=grid",
    "/projects?layout=cards",
    "/projects/zandatax",
    "/projects/mtn",
    "/projects/nogicjqs",
    "/blog",
    "/blog/inspiring-the-world",
    "/blog/bring-your-ideas-to-life",
    "/blog/approach-and-dedication",
    "/contact",
    "/privacy",
    "/terms",
  ];
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
  }
  const missingPage = await page.goto("/projects/does-not-exist");
  // Next.js preserves HTTP 200 when not-found renders after streaming starts.
  expect([200, 404]).toContain(missingPage?.status());
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found",
  );
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    "noindex",
  );
});

test("email drafts preserve the user's message and encode query delimiters", () => {
  const formData = new FormData();
  formData.set("name", "Alex & Sam");
  formData.set("email", "alex@example.com");
  formData.set("subject", "Design & development?");
  formData.set("message", "Hello!\nCan we discuss a project? & next steps");
  const draft = new URL(createEmailDraft(formData));
  expect(draft.protocol).toBe("mailto:");
  expect(draft.searchParams.get("subject")).toBe("Design & development?");
  expect(draft.searchParams.get("body")).toContain("Alex & Sam");
  expect(draft.searchParams.get("body")).toContain(
    "Hello!\nCan we discuss a project? & next steps",
  );
});
