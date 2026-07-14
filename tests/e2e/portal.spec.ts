import { expect, test } from "@playwright/test";

test("portal explains missing configuration without exposing a broken login", async ({ page }) => {
  await page.goto("/portal");
  await expect(page.getByRole("heading", { name: /connect supabase to continue/i })).toBeVisible();
  await expect(page.getByText(/copy \.env\.example to \.env\.local/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /back to website/i })).toBeVisible();

});
