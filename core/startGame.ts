import { getEvilCount, MAX_PLAYERS, MIN_PLAYERS } from "@/core/gameConfig.ts";
import type { Game, GameOptions, Role } from "@/core/types.ts";
import { defaultOptions } from "@/core/types.ts";

/**
 * Validates if a game can be started.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateStartGame = (
  game: Game,
  overrides: Partial<GameOptions> = {},
): string | null => {
  if (game.stage !== "preparing") {
    return "Game has already started";
  }

  if (game.players.length < MIN_PLAYERS) {
    return `Need at least ${MIN_PLAYERS} players to start`;
  }

  if (game.players.length > MAX_PLAYERS) {
    return `Maximum ${MAX_PLAYERS} players allowed`;
  }

  // Validate special role combinations
  const evilCount = getEvilCount(game.players.length);
  const goodCount = game.players.length - evilCount;

  const options = { ...defaultOptions, ...overrides };

  const evilSpecialRoles = [
    options.mordred,
    options.morgana,
    options.oberon,
  ].filter(Boolean).length;

  const goodSpecialRoles = [
    options.merlin,
    options.percival,
  ].filter(Boolean).length;

  if (evilSpecialRoles > evilCount) {
    return "Too many evil special roles for the number of evil players";
  }

  if (goodSpecialRoles > goodCount) {
    return "Too many good special roles for the number of good players";
  }

  // Percival requires Merlin
  if (options.percival && !options.merlin) {
    return "Percival requires Merlin to be in the game";
  }

  // Morgana requires Merlin and Percival to be meaningful
  if (
    options.morgana && (!options.merlin || !options.percival)
  ) {
    return "Morgana requires both Merlin and Percival to be in the game";
  }

  return null;
};

/**
 * Starts a game (assigns roles to all players and moves to the first quest).
 * Assumes validation has been done via validateStartGame.
 */
export const startGame = (
  game: Game,
  overrides: Partial<GameOptions> = {},
): Game => {
  const options = { ...defaultOptions, ...overrides };
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
    quests: game.quests.with(0, {
      stage: "team-building",
      fails: 0,
      teamProposals: [],
      votes: {},
    }),
  };
};

/**
 * Shuffles an array randomly using Fisher-Yates algorithm.
 */
const shuffle = <Type>(array: Type[]): Type[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};
