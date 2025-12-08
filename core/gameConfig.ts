import { Role } from "@/core/types.ts";

// number of players
export const MAX_PLAYERS = 10;
export const MIN_PLAYERS = 5;

// number of evil players
export const getEvilCount = (playerCount: number): number => {
  if (playerCount <= 6) return 2;
  if (playerCount <= 9) return 3;
  return 4;
};

// team size per quest
export const getRequiredTeamSize = (
  playerCount: number,
  questNumber: number,
): number => {
  const QUEST_TEAM_SIZES: Record<number, number[]> = {
    5: [2, 3, 2, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5],
  };
  const questIndex = questNumber - 1;
  return QUEST_TEAM_SIZES[playerCount]?.[questIndex] ?? 0;
};

// number of fail votes required for quest to fail
export const getRequiredFails = (
  playerCount: number,
  questNumber: number,
): number => {
  return playerCount >= 7 && questNumber === 4 ? 2 : 1;
};

// alignment
export const isGood = (role: Role) => {
  return ["merlin", "percival", "servant"].includes(role);
};

export const isEvil = (role: Role) => {
  return !isGood(role);
};

// visible role
export const getVisibleRoleForPlayer = (
  actualRole: Role,
  viewerRole: Role,
): string => {
  switch (viewerRole) {
    case "merlin":
      if (actualRole === "morgana") return "minion";
      if (actualRole === "oberon") return "minion";
      if (actualRole === "minion") return "minion";
      return "unknown";
    case "percival":
      if (actualRole === "merlin") return "merlin";
      if (actualRole === "morgana") return "merlin";
      return "unknown";
    case "mordred":
    case "morgana":
    case "minion":
      if (actualRole === "mordred") return "minion";
      if (actualRole === "morgana") return "minion";
      if (actualRole === "minion") return "minion";
      return "unknown";
    case "servant":
    case "oberon":
      return "unknown";
    default:
      return viewerRole satisfies never;
  }
};
