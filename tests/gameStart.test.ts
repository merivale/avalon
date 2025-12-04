import { assertEquals } from "@std/assert";
import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { type Browser, chromium } from "playwright";

const BASE_URL = "http://localhost:8080";

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser.close();
});

describe.skip("Game in preparing state", () => {
  it("should allow players not in the game to join it", async () => {});

  it("should display players already in the game", async () => {});

  it("should not show Join Game button to players already in the game", async () => {});

  it("should enforce a maximum of 10 players", async () => {});

  it("should not allow starting the game with fewer than 5 players", async () => {});

  it("should not allow starting with invalid special role combinations", async () => {});

  it("should allow starting with valid player count and special roles", async () => {});

  it("should allow starting with no special roles selected", async () => {});
});
