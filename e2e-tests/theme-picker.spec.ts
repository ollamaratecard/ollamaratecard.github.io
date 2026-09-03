import { test, expect, type Page } from "@playwright/test";

// Theme picker dropdown must be fully visible when opened.
// Regression guard: the dropdown opens upward from the header button and must
// not be clipped by the viewport or by its container.

async function openThemeMenu(page: Page) {
  // Button's accessible name is the current theme label (e.g. "Cupcake");
  // it also has an aria-haspopup listbox, which makes it unique in the header.
  await page.locator('button[aria-haspopup="listbox"]').click();
  const menu = page.getByRole("listbox", { name: "Theme" });
  await expect(menu).toBeVisible();
  return menu;
}

test("theme dropdown is fully visible and theme choice persists", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");

  const menu = await openThemeMenu(page);

  // The menu has 32 items; the listbox scrolls internally but the visible
  // portion of the menu must fit entirely within the viewport.
  const box = await menu.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(720);

  // The active theme's option must be scrolled into view (not clipped by the
  // menu's own internal scroll area).
  const activeOption = menu.getByRole("option", { selected: true });
  await expect(activeOption).toBeVisible();
  const optBox = await activeOption.boundingBox();
  expect(optBox).not.toBeNull();
  if (optBox) {
    expect(optBox.y).toBeGreaterThanOrEqual(box.y - 1);
    expect(optBox.y + optBox.height).toBeLessThanOrEqual(box.y + box.height + 1);
  }

  // Pick a different theme; the html data-theme attribute changes
  await menu.getByRole("option", { name: "Dracula" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");

  // Reload → theme persists via localStorage
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dracula");

  // And the picker button shows Dracula as current
  const menu2 = await openThemeMenu(page);
  await expect(menu2.getByRole("option", { name: "Dracula", selected: true })).toBeVisible();
});

test("theme dropdown stays within viewport on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");

  const menu = await openThemeMenu(page);
  const box = await menu.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(700);
});
