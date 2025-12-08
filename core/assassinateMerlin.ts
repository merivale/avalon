import type { Game } from "@/core/types.ts";

/**
 * Validates if the player can assassinate Merlin.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateAssassinateMerlin = (
  game: Game,
  playerId: string,
  targetId: string,
): string | null => {
  if (game.stage !== "assassination") {
    return "Assassination can only occur during the assassination stage";
  }

  const playerRole = game.roleAssignments[playerId]!;
  const evilRoles = ["minion", "mordred", "morgana", "oberon"];
  if (!evilRoles.includes(playerRole)) {
    return "Only evil players can perform the assassination";
  }

  if (!game.players.some((player) => player.id === targetId)) {
    return "Target player does not exist in the game";
  }

  return null;
};

/**
 * Performs the attempted assassination of Merlin and updates the game state accordingly.
 * Assumes the assassination has been validated.
 */
export const assassinateMerlin = (
  game: Game,
  targetId: string,
): Game => {
  const merlinId = Object.entries(game.roleAssignments).find(
    ([, role]) => role === "merlin",
  )?.[0];

  const assassinationSucceeded = merlinId === targetId;

  return {
    ...game,
    stage: assassinationSucceeded ? "evil-wins-by-assassination" : "good-wins",
  };
};
