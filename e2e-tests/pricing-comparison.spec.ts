import { test, expect } from "@playwright/test";

// Critical user journey: compare a model's cost across subscription plans.
// 1. Landing shows the pricing table with 19 models, default-sorted by
//    Blended (effective) ascending, on the Pro (Monthly) plan (3× multiplier).
// 2. Switching to Max (5× multiplier) recalculates effective prices in place.
// 3. Search filters rows live and can be cleared via the × button.

test("compare model pricing across plans with search", async ({ page }) => {
  await page.goto("/");

  // Table renders all models, default plan is Pro (Monthly) with a 3.00× multiplier
  await expect(page.getByRole("heading", { name: /OllamaRateCard/i })).toBeVisible();
  const planTabs = page.getByRole("tablist", { name: "Subscription plan" });
  await expect(planTabs.getByRole("tab", { name: "Pro (Monthly)" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
  await expect(planTabs.getByRole("tab", { name: "Pro (Yearly)" })).toBeVisible();
  await expect(planTabs.getByRole("tab", { name: "Max" })).toBeVisible();
  await expect(planTabs.getByRole("tab", { name: "Team" })).toBeVisible();

  const rows = page.locator("table tbody tr");
  await expect(rows).toHaveCount(19);

  // Default sort: Blended (effective) ascending → nemotron-3-nano (cheapest
  // blended, $0.035) is first.
  const firstModelCell = rows.first().locator("td").first();
  await expect(firstModelCell).toContainText("nemotron-3-nano");

  // Pro Monthly (60/20 = 3×): kimi-k3 output $15.00 listed → $5.00 effective
  const kimiRow = page.locator("table tbody tr", { hasText: "kimi-k3" });
  await expect(kimiRow).toHaveCount(1);
  const kimiOutputEffective = kimiRow.locator("td").nth(5);
  await expect(kimiOutputEffective).toContainText("$5.00");

  // Switch to Team (1000/500 = 2×): effective output becomes $7.50
  await planTabs.getByRole("tab", { name: "Team" }).click();
  await expect(planTabs.getByRole("tab", { name: "Team" })).toHaveAttribute(
    "aria-selected",
    "true"
  );
  await expect(kimiOutputEffective).toContainText("$7.50");

  // Sort order by blended effective is unchanged after plan switch
  await expect(rows.first().locator("td").first()).toContainText("nemotron-3-nano");

  // Search filters live; default sort (blended effective, low → high) puts
  // gpt-oss:20b (cheapest blended) before gpt-oss:120b.
  const searchBox = page.getByLabel("Search models");
  await searchBox.fill("gpt-oss");
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText("gpt-oss:20b");
  await expect(rows.nth(1)).toContainText("gpt-oss:120b");

  // Clear via × button restores the full table
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(searchBox).toHaveValue("");
  await expect(rows).toHaveCount(19);
});