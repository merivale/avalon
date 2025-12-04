import type { Game, GameOptions, Role } from "@/core/types.ts";

/**
 * Validates if a game can be started.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateStartGame = (
  game: Game,
  specialRoles: GameOptions,
): string | null => {
  if (game.stage !== "preparing") {
    return "Game has already started";
  }

  if (game.players.length < 5) {
    return "Need at least 5 players to start";
  }

  if (game.players.length > 10) {
    return "Maximum 10 players allowed";
  }

  // Validate special role combinations
  const evilCount = getEvilCount(game.players.length);
  const goodCount = game.players.length - evilCount;

  const evilSpecialRoles = [
    specialRoles.mordred,
    specialRoles.morgana,
    specialRoles.oberon,
  ].filter(Boolean).length;

  const goodSpecialRoles = [
    specialRoles.merlin,
    specialRoles.percival,
  ].filter(Boolean).length;

  if (evilSpecialRoles > evilCount) {
    return "Too many evil special roles for the number of evil players";
  }

  if (goodSpecialRoles > goodCount) {
    return "Too many good special roles for the number of good players";
  }

  // Percival requires Merlin
  if (specialRoles.percival && !specialRoles.merlin) {
    return "Percival requires Merlin to be in the game";
  }

  // Morgana requires Merlin and Percival to be meaningful
  if (
    specialRoles.morgana && (!specialRoles.merlin || !specialRoles.percival)
  ) {
    return "Morgana requires both Merlin and Percival to be in the game";
  }

  return null;
};

/**
 * Starts a game (assigns roles to all players and moves to the first quest).
 * Assumes validation has been done via validateStartGame.
 */
export const startGame = (game: Game, options: GameOptions): Game => {
  const playerCount = game.players.length;
  const evilCount = getEvilCount(playerCount);
  const goodCount = playerCount - evilCount;

  // Build the role pool
  const goodRoles: Role[] = [];
  const evilRoles: Role[] = [];

  // Add special roles for good
  if (options.merlin) goodRoles.push("merlin");
  if (options.percival) goodRoles.push("percival");

  // Fill remaining good slots with servants
  while (goodRoles.length < goodCount) {
    goodRoles.push("servant");
  }

  // Add special roles for evil
  if (options.mordred) evilRoles.push("mordred");
  if (options.morgana) evilRoles.push("morgana");
  if (options.oberon) evilRoles.push("oberon");

  // Fill remaining evil slots with minions
  while (evilRoles.length < evilCount) {
    evilRoles.push("minion");
  }

  // Combine and shuffle all roles
  const allRoles = shuffle([...goodRoles, ...evilRoles]);

  // Assign roles to players
  const roleAssignments: Record<string, Role> = game.players.reduce(
    (acc, player, index) => ({ ...acc, [player.id]: allRoles[index] }),
    {},
  );

  return {
    ...game,
    stage: "playing",
    roleAssignments,
    quests: [
      {
        stage: "team-building",
        teamProposals: [],
        votes: {},
      }
    ],
  };
};

/**
 * Returns the number of evil players based on total player count.
 */
const getEvilCount = (playerCount: number): number => {
  if (playerCount <= 6) return 2;
  if (playerCount <= 9) return 3;
  return 4;
};

/**
 * Shuffles an array randomly using Fisher-Yates algorithm.
 */
const shuffle = <Type>(array: Type[]): Type[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
