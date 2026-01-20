import { joinGame, validateJoinGame } from "@/core/joinGame.ts";
import { createTestGame, createTestPlayer } from "@/core/testUtils.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("validateJoinGame", () => {
  it("returns null when game is preparing and player is new", () => {
    const game = createTestGame({
      players: [
        createTestPlayer({ id: "player-1" }),
        createTestPlayer({ id: "player-2" }),
      ],
    });
    const player3 = createTestPlayer({ id: "player-3" });
    const result = validateJoinGame(game, player3);
    assertEquals(result, null);
  });

  it("returns error when game has already started", () => {
    const game = createTestGame({ stage: "playing" });
    const newPlayer = createTestPlayer();
    const result = validateJoinGame(game, newPlayer);
    assertEquals(result, "Game has already started");
  });

  it("returns error when player is already in the game", () => {
    const player = createTestPlayer();
    const game = createTestGame({ players: [player] });
    const result = validateJoinGame(game, player);
    assertEquals(result, "Player is already in the game");
  });

  it("returns error when game is full (10 players)", () => {
    const game = createTestGame({
      players: [
        createTestPlayer({ id: "player-1" }),
        createTestPlayer({ id: "player-2" }),
        createTestPlayer({ id: "player-3" }),
        createTestPlayer({ id: "player-4" }),
        createTestPlayer({ id: "player-5" }),
        createTestPlayer({ id: "player-6" }),
        createTestPlayer({ id: "player-7" }),
        createTestPlayer({ id: "player-8" }),
        createTestPlayer({ id: "player-9" }),
        createTestPlayer({ id: "player-10" }),
      ],
    });
    const player11 = createTestPlayer({ id: "player-11" });
    const result = validateJoinGame(game, player11);
    assertEquals(result, "Game is full (maximum 10 players)");
  });
});

describe("joinGame", () => {
  it("adds player to the game", () => {
    const game = createTestGame({
      players: [
        createTestPlayer({ id: "player-1" }),
        createTestPlayer({ id: "player-2" }),
      ],
    });
    const player3 = createTestPlayer({ id: "player-3" });
    const result = joinGame(game, player3);
    assertEquals(result.players.length, 3);
    assertEquals(result.players[2], player3);
  });

  it("preserves existing players", () => {
    const player1 = createTestPlayer({ id: "player-1" });
    const player2 = createTestPlayer({ id: "player-2" });
    const player3 = createTestPlayer({ id: "player-3" });
    const game = createTestGame({ players: [player1, player2] });
    const result = joinGame(game, player3);
    assertEquals(result.players[0], game.players[0]);
    assertEquals(result.players[1], game.players[1]);
  });

  it("preserves other game state", () => {
    const player1 = createTestPlayer({ id: "player-1" });
    const player2 = createTestPlayer({ id: "player-2" });
    const player3 = createTestPlayer({ id: "player-3" });
    const game = createTestGame({ players: [player1, player2] });
    const result = joinGame(game, player3);
    assertEquals(result.id, game.id);
    assertEquals(result.stage, game.stage);
    assertEquals(result.leaderIndex, game.leaderIndex);
    assertEquals(result.questIndex, game.questIndex);
  });
});
