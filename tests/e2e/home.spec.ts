import { expect, test } from "@playwright/test";

test("homepage presents clear navigation and an operable enquiry flow", async ({ page }, testInfo) => {
  await page.route("**/api/inquiries", async (route) => {
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /learn better/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /learning portal/i })).toBeVisible();

  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    await expect(page.getByRole("navigation", { name: /mobile navigation/i })).toBeVisible();
    await page.getByRole("link", { name: "Programs", exact: true }).click();
  }

  await page.getByLabel(/full name/i).fill("Aman Singh");
  await page.getByLabel(/select course/i).selectOption({ label: "IELTS Hybrid" });
  await page.getByLabel(/phone \/ email/i).fill("aman@example.com");
  await page.getByLabel(/preferred time/i).selectOption("Evening");
  await page.getByRole("button", { name: /enquire now/i }).click();
  await expect(page.getByRole("status")).toContainText("contact you shortly");

});

test("homepage has no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport + 1);
});
