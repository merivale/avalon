import { startGame, validateStartGame } from "@/core/startGame.ts";
import { createTestGame, createTestPlayer } from "@/core/testUtils.ts";
import type { Game } from "@/core/types.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

const createTestGameWithNPlayers = (n: number): Game => {
  const players = Array.from({ length: n }, (_, i) =>
    createTestPlayer({ id: `player-${i + 1}` })
  );
  return createTestGame({ players });
};

describe("validateStartGame", () => {
  it("returns null when game is preparing with 5 players", () => {
    const game = createTestGameWithNPlayers(5);
    const result = validateStartGame(game);
    assertEquals(result, null);
  });

  it("returns error when game has already started", () => {
    const game = createTestGame({ stage: "playing" });
    const result = validateStartGame(game);
    assertEquals(result, "Game has already started");
  });

  it("returns error when fewer than 5 players", () => {
    const game = createTestGameWithNPlayers(4);
    const result = validateStartGame(game);
    assertEquals(result, "Need at least 5 players to start");
  });

  it("returns error when more than 10 players", () => {
    const game = createTestGameWithNPlayers(11);
    const result = validateStartGame(game);
    assertEquals(result, "Maximum 10 players allowed");
  });

  it("returns error when too many evil special roles", () => {
    const game = createTestGameWithNPlayers(5);
    const result = validateStartGame(game, {
      mordred: true,
      morgana: true,
      oberon: true,
    });
    assertEquals(
      result,
      "Too many evil special roles for the number of evil players",
    );
  });

  it("returns error when Percival without Merlin", () => {
    const game = createTestGameWithNPlayers(5);
    const result = validateStartGame(game, { percival: true });
    assertEquals(result, "Percival requires Merlin to be in the game");
  });

  it("returns error when Morgana without Percival", () => {
    const game = createTestGameWithNPlayers(5);
    const result = validateStartGame(game, {
      merlin: true,
      morgana: true,
    });
    assertEquals(
      result,
      "Morgana requires both Merlin and Percival to be in the game",
    );
  });

  it("returns null when Merlin and Percival are enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = validateStartGame(game, {
      merlin: true,
      percival: true,
    });
    assertEquals(result, null);
  });

  it("returns null when Merlin, Percival, and Morgana are enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = validateStartGame(game, {
      merlin: true,
      percival: true,
      morgana: true,
    });
    assertEquals(result, null);
  });
});

describe("startGame", () => {
  it("sets stage to playing", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    assertEquals(result.stage, "playing");
  });

  it("assigns roles to all players", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    assertEquals(Object.keys(result.roleAssignments).length, 5);
    assertEquals(result.roleAssignments["player-1"] !== undefined, true);
    assertEquals(result.roleAssignments["player-2"] !== undefined, true);
    assertEquals(result.roleAssignments["player-3"] !== undefined, true);
    assertEquals(result.roleAssignments["player-4"] !== undefined, true);
    assertEquals(result.roleAssignments["player-5"] !== undefined, true);
  });

  it("assigns correct number of good and evil roles for 5 players", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    const roles = Object.values(result.roleAssignments);
    const goodRoles = roles.filter((r) =>
      ["merlin", "percival", "servant"].includes(r)
    );
    const evilRoles = roles.filter((r) =>
      ["minion", "mordred", "morgana", "oberon"].includes(r)
    );
    assertEquals(goodRoles.length, 3);
    assertEquals(evilRoles.length, 2);
  });

  it("assigns Merlin when enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game, { merlin: true });
    const roles = Object.values(result.roleAssignments);
    assertEquals(roles.includes("merlin"), true);
  });

  it("assigns Percival when enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game, { merlin: true, percival: true });
    const roles = Object.values(result.roleAssignments);
    assertEquals(roles.includes("percival"), true);
  });

  it("assigns Mordred when enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game, { mordred: true });
    const roles = Object.values(result.roleAssignments);
    assertEquals(roles.includes("mordred"), true);
  });

  it("assigns Morgana when enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game, {
      merlin: true,
      percival: true,
      morgana: true,
    });
    const roles = Object.values(result.roleAssignments);
    assertEquals(roles.includes("morgana"), true);
  });

  it("assigns Oberon when enabled", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game, { oberon: true });
    const roles = Object.values(result.roleAssignments);
    assertEquals(roles.includes("oberon"), true);
  });

  it("fills remaining good slots with servants", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    const roles = Object.values(result.roleAssignments);
    const servants = roles.filter((r) => r === "servant");
    assertEquals(servants.length, 3);
  });

  it("fills remaining evil slots with minions", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    const roles = Object.values(result.roleAssignments);
    const minions = roles.filter((r) => r === "minion");
    assertEquals(minions.length, 2);
  });

  it("sets first quest to team-building stage", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    assertEquals(result.quests[0]!.stage, "team-building");
  });

  it("preserves other quest properties", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    assertEquals(result.quests[0]!.fails, 0);
    assertEquals(result.quests[0]!.teamProposals.length, 0);
    assertEquals(Object.keys(result.quests[0]!.votes).length, 0);
  });

  it("preserves other quests unchanged", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    assertEquals(result.quests.length, 5);
    assertEquals(result.quests[1]!.stage, "not-started");
    assertEquals(result.quests[2]!.stage, "not-started");
    assertEquals(result.quests[3]!.stage, "not-started");
    assertEquals(result.quests[4]!.stage, "not-started");
  });

  it("preserves other game state", () => {
    const game = createTestGameWithNPlayers(5);
    const result = startGame(game);
    assertEquals(result.id, game.id);
    assertEquals(result.players, game.players);
    assertEquals(result.leaderIndex, game.leaderIndex);
    assertEquals(result.questIndex, game.questIndex);
  });
});
