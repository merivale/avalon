import {
  assassinateMerlin,
  validateAssassinateMerlin,
} from "@/core/assassinateMerlin.ts";
import { createTestGame, createTestPlayer } from "@/core/testUtils.ts";
import type { Game } from "@/core/types.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

const testPlayers = [
  createTestPlayer({ id: "merlin" }),
  createTestPlayer({ id: "percival" }),
  createTestPlayer({ id: "servant" }),
  createTestPlayer({ id: "mordred" }),
  createTestPlayer({ id: "morgana" }),
  createTestPlayer({ id: "oberon" }),
  createTestPlayer({ id: "minion" }),
];

const createTestAssassinationGame = (overrides?: Partial<Game>): Game => ({
  ...createTestGame(),
  stage: "assassination",
  players: testPlayers,
  roleAssignments: {
    "merlin": "merlin",
    "percival": "percival",
    "servant": "servant",
    "mordred": "mordred",
    "morgana": "morgana",
    "oberon": "oberon",
    "minion": "minion",
  },
  ...overrides,
});

describe("validateAssassinateMerlin", () => {
  it("returns null when game is in assassination stage, player is evil, and target exists", () => {
    const game = createTestAssassinationGame();
    const result1 = validateAssassinateMerlin(game, "mordred", "merlin");
    assertEquals(result1, null);
    const result2 = validateAssassinateMerlin(game, "morgana", "merlin");
    assertEquals(result2, null);
    const result3 = validateAssassinateMerlin(game, "oberon", "merlin");
    assertEquals(result3, null);
    const result4 = validateAssassinateMerlin(game, "minion", "merlin");
    assertEquals(result4, null);
  });

  it("returns error when game is not in assassination stage", () => {
    const game = createTestAssassinationGame({ stage: "playing" });
    const result = validateAssassinateMerlin(game, "mordred", "merlin");
    assertEquals(
      result,
      "Assassination can only occur during the assassination stage",
    );
  });

  it("returns error when player has a good role", () => {
    const game = createTestAssassinationGame();
    const result1 = validateAssassinateMerlin(game, "merlin", "mordred");
    assertEquals(
      result1,
      "Only evil players can perform the assassination",
    );
    const result2 = validateAssassinateMerlin(game, "percival", "mordred");
    assertEquals(
      result2,
      "Only evil players can perform the assassination",
    );
    const result3 = validateAssassinateMerlin(game, "servant", "mordred");
    assertEquals(
      result3,
      "Only evil players can perform the assassination",
    );
  });

  it("returns error when assassin player does not exist in game", () => {
    const game = createTestAssassinationGame();
    const result = validateAssassinateMerlin(
      game,
      "non-existent-player",
      "merlin",
    );
    assertEquals(result, "Player does not exist in the game");
  });

  it("returns error when target player does not exist in game", () => {
    const game = createTestAssassinationGame();
    const result = validateAssassinateMerlin(
      game,
      "mordred",
      "non-existent-player",
    );
    assertEquals(result, "Target player does not exist in the game");
  });
});

describe("assassinateMerlin", () => {
  it("sets stage to 'evil-wins-by-assassination' when target is Merlin", () => {
    const game = createTestAssassinationGame();
    const result = assassinateMerlin(game, "merlin");
    assertEquals(result.stage, "evil-wins-by-assassination");
  });

  it("sets stage to 'good-wins' when target is not Merlin", () => {
    const game = createTestAssassinationGame();
    const result1 = assassinateMerlin(game, "percival");
    assertEquals(result1.stage, "good-wins");
    const result2 = assassinateMerlin(game, "servant");
    assertEquals(result2.stage, "good-wins");
  });

  it("preserves other game state", () => {
    const game = createTestAssassinationGame();
    const result = assassinateMerlin(game, "merlin");
    assertEquals(result.id, game.id);
    assertEquals(result.players, game.players);
    assertEquals(result.roleAssignments, game.roleAssignments);
    assertEquals(result.leaderIndex, game.leaderIndex);
    assertEquals(result.questIndex, game.questIndex);
    assertEquals(result.quests, game.quests);
  });
});
