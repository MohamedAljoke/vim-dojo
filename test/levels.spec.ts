import { expect, type Page, test } from "@playwright/test";

import { levels } from "../src/levels";
import { tokenize } from "../src/levels/keys";

const PLAYWRIGHT_KEYS: Record<string, string> = {
  "<Esc>": "Escape",
  "<CR>": "Enter",
  "<Up>": "ArrowUp",
  "<Down>": "ArrowDown",
  "<Left>": "ArrowLeft",
  "<Right>": "ArrowRight",
  "<BS>": "Backspace",
};

async function play(page: Page, sequence: string) {
  for (const key of tokenize(sequence)) {
    const ctrl = /^<C-([a-z])>$/.exec(key);
    if (ctrl) await page.keyboard.press(`Control+${ctrl[1]}`);
    else if (PLAYWRIGHT_KEYS[key]) await page.keyboard.press(PLAYWRIGHT_KEYS[key]);
    else await page.keyboard.type(key);
  }
}

async function open(page: Page, id: string) {
  await page.goto(`#/level/${id}`);
  await expect(page.getByRole("textbox", { name: "Manifest editor (vim)" })).toBeFocused();
}

for (const level of levels) {
  test(`level ${level.id} (${level.title}) is cleared at par by its reference solution`, async ({ page }) => {
    await open(page, level.id);
    await play(page, level.solution);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img", { name: "3 of 3 stars" })).toBeVisible();
    await expect(dialog.getByText(`You · ${level.par} keys`)).toBeVisible();
  });
}

test("a wrong :wq is rejected and the level keeps going", async ({ page }) => {
  await open(page, "1-2");
  await play(page, ":wq<CR>");
  await expect(page.getByText(/Manifest rejected — 1 line still differs?/)).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test(":q with unsaved changes refuses, :q! restarts", async ({ page }) => {
  await open(page, "1-4");
  await play(page, "x:q<CR>");
  await expect(page.getByText(/E37: No write since last change/)).toBeVisible();
  await play(page, ":q!<CR>");
  await expect(page.getByText("Nothing typed yet.")).toBeVisible();
  await expect(page.locator(".cm-content")).toContainText("replicas: 30");
});

test("arrow keys count, so arrowing earns fewer stars than jumping", async ({ page }) => {
  await open(page, "2-4");
  await play(page, "<Right>".repeat(45));
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img", { name: "1 of 3 stars" })).toBeVisible();
});

test("progress is remembered on the map", async ({ page }) => {
  await open(page, "1-1");
  await play(page, ":wq<CR>");
  await page.goto("#/");
  await expect(page.getByText(`3 / ${levels.length * 3} stars`)).toBeVisible();
});
