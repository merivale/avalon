import type { Game } from "@/core/types.ts";

/**
 * Validates if a player can join a game.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateJoinGame = (game: Game, playerId: string): string | null => {
  if (game.stage !== "preparing") {
    return "Game has already started";
  }

  if (game.playerIds.includes(playerId)) {
    return "Player is already in the game";
  }

  if (game.playerIds.length >= 10) {
    return "Game is full (maximum 10 players)";
  }

  return null;
};

/**
 * Adds a player to a game.
 * Assumes validation has been done via validateJoinGame.
 */
export const joinGame = (game: Game, playerId: string): Game => ({
  ...game,
  playerIds: [...game.playerIds, playerId],
});
