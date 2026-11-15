import { expect, test } from "@playwright/test";

test("AI stays first with a detail link while employer platforms are visible", async ({
  page,
}) => {
  await page.goto("/projects");
  const firstProject = page.locator("main article").first();
  await expect(firstProject.getByRole("heading", { level: 3 })).toHaveText(
    "AI (Machine Learning) Engineer Project",
  );
  await expect(firstProject.getByRole("link")).toHaveAttribute(
    "href",
    "/projects/ai-machine-learning",
  );
  for (const href of [
    "https://enrolledagent.com/",
    "https://www.mtn.ng/",
    "https://nogicjqs.gov.ng/",
  ]) {
    await expect(page.locator(`main a[href="${href}"]`)).toBeVisible();
  }
});

test("AI collection lists seven projects with results, images, and source links", async ({
  page,
}) => {
  await page.goto("/projects/ai-machine-learning");
  const articles = page.locator("main article");
  await expect(articles).toHaveCount(7);
  for (const article of await articles.all()) {
    await expect(article.getByRole("heading", { level: 3 })).toBeAttached();
    await expect(
      article.getByRole("heading", { name: "Results & Outcomes" }),
    ).toBeAttached();
    await expect(
      article.locator('a[href^="https://github.com/sazzeb/"]'),
    ).toHaveCount(1);
    const image = article.locator("figure img");
    await image.evaluate((element: HTMLImageElement) => {
      element.loading = "eager";
    });
    await expect
      .poll(() =>
        image.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0);
  }
});

test("employer project pages show CV roles, outcomes, platform links, and matching images", async ({
  page,
}) => {
  const cases = [
    {
      slug: "zandatax",
      role: "Full Stack Engineer",
      folder: "enrolledagent",
      href: "https://enrolledagent.com/",
      count: 4,
    },
    {
      slug: "mtn",
      role: "Full Stack Developer / Live Support Engineer",
      folder: "mtn",
      href: "https://www.mtn.ng/",
      count: 5,
    },
    {
      slug: "nogicjqs",
      role: "Full Stack Developer",
      folder: "nogicjqs",
      href: "https://nogicjqs.gov.ng/",
      count: 5,
    },
  ];
  for (const item of cases) {
    await page.goto(`/projects/${item.slug}`);
    await expect(
      page.getByRole("heading", {
        name: "My Role & Contribution",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText(item.role);
    await expect(
      page.getByRole("heading", {
        name: "Improvements & Achievements",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(`main a[href="${item.href}"]`)).toHaveCount(2);
    await expect(page.locator("main img")).toHaveCount(item.count);
    await expect(
      page.getByRole("heading", { name: "Platform Screenshots", exact: true }),
    ).toHaveCount(0);
    const banner = page.getByRole("region", {
      name: /screenshot slideshow$/,
    });
    await banner
      .getByRole("button", { name: "Next screenshot", exact: true })
      .click();
    await expect(
      banner.getByRole("button", { name: "Show screenshot 2", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await banner
      .getByRole("button", { name: "Previous screenshot", exact: true })
      .click();
    await expect(
      banner.getByRole("button", { name: "Show screenshot 1", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    const sources = await page
      .locator("main img")
      .evaluateAll((images) =>
        images.map((image) =>
          decodeURIComponent(image.getAttribute("src") ?? ""),
        ),
      );
    expect(
      sources.every((source) =>
        source.includes(`/images/project/${item.folder}/`),
      ),
    ).toBe(true);
    await expect(page.locator("main")).not.toContainText(
      /Texas Department of Criminal Justice|Arcadis/,
    );
  }
});
