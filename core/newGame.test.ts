import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertMatch } from "@std/assert";
import newGame from "@/core/newGame.ts";

describe("newGame", () => {
  it("creates game with provided id", () => {
    const result = newGame("game-123");
    assertEquals(result.id, "game-123");
  });

  it("generates random UUID when no id provided", () => {
    const result = newGame();
    assertMatch(
      result.id,
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("sets stage to preparing", () => {
    const result = newGame();
    assertEquals(result.stage, "preparing");
  });

  it("initializes with empty players array", () => {
    const result = newGame();
    assertEquals(result.players, []);
  });

  it("initializes with empty role assignments", () => {
    const result = newGame();
    assertEquals(result.roleAssignments, {});
  });

  it("sets leaderIndex to 0", () => {
    const result = newGame();
    assertEquals(result.leaderIndex, 0);
  });

  it("sets questIndex to 0", () => {
    const result = newGame();
    assertEquals(result.questIndex, 0);
  });

  it("sets assassinationTargetId to null", () => {
    const result = newGame();
    assertEquals(result.assassinationTargetId, null);
  });

  it("creates 5 quests", () => {
    const result = newGame();
    assertEquals(result.quests.length, 5);
  });

  it("initializes all quests as not-started", () => {
    const result = newGame();
    assertEquals(result.quests.every((q) => q.stage === "not-started"), true);
  });

  it("initializes all quests with 0 fails", () => {
    const result = newGame();
    assertEquals(result.quests.every((q) => q.fails === 0), true);
  });

  it("initializes all quests with empty team proposals", () => {
    const result = newGame();
    assertEquals(
      result.quests.every((q) => q.teamProposals.length === 0),
      true,
    );
  });

  it("initializes all quests with empty votes", () => {
    const result = newGame();
    assertEquals(
      result.quests.every((q) => Object.keys(q.votes).length === 0),
      true,
    );
  });
});
