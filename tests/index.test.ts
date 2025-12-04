import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { chromium } from "playwright";

const BASE_URL = "http://localhost:8080";

const browser = await chromium.launch();
const page = await browser.newPage();

describe("Index page", () => {
  it("should render correctly", async () => {
    await page.goto(BASE_URL);

    // Check page title
    const heading = await page.textContent("h1");
    assertEquals(heading?.trim(), "Avalon", "Page should have 'Avalon' as h1");

    // Check that "Create New Game" button exists
    const createGameButton = page.locator(
      'button[type="submit"]:has-text("Create New Game")',
    );
    assertEquals(
      await createGameButton.count(),
      1,
      "Should have Create New Game button",
    );

    // Check that "Join Game" form exists
    const joinGameInput = page.locator('input[name="gameId"]');
    assertEquals(
      await joinGameInput.count(),
      1,
      "Should have game ID input field",
    );

    const joinGameButton = page.locator(
      'button[type="submit"]:has-text("Join Game")',
    );
    assertEquals(
      await joinGameButton.count(),
      1,
      "Should have Join Game button",
    );
  });

  it("should navigate to game page when Create New Game is clicked", async () => {
    await page.goto(BASE_URL);

    // Click the Create New Game button
    await page.click('button[type="submit"]:has-text("Create New Game")');

    // Wait for navigation
    await page.waitForURL(/\/game\/.+/);

    // Verify we're on a game page
    const url = page.url();
    assertEquals(
      url.includes("/game/"),
      true,
      "Should navigate to a game page",
    );
  });

  it("should require game ID for Join Game", async () => {
    await page.goto(BASE_URL);

    // Try to submit the join game form without entering a game ID
    const joinGameButton = page.locator(
      'button[type="submit"]:has-text("Join Game")',
    );
    await joinGameButton.click();

    // The required attribute should prevent submission
    const gameIdInput = page.locator('input[name="gameId"]');
    const isRequired = await gameIdInput.getAttribute("required");
    assertEquals(isRequired !== null, true, "Game ID input should be required");
  });
});
