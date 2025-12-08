import { getRequiredTeamSize } from "@/core/gameConfig.ts";
import type { Game, Quest } from "@/core/types.ts";

/**
 * Validates if a team proposal can be made.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateProposeTeam = (
  game: Game,
  leaderId: string,
  teamMemberIds: string[],
): string | null => {
  const quest = game.quests[game.questIndex]!;
  if (game.stage !== "playing" || quest.stage !== "team-building") {
    return "Teams can only be proposed during the team-building stage";
  }

  if (quest.teamProposals.length >= 5) {
    return "Maximum of 5 team proposals reached for this quest";
  }

  const leader = game.players[game.leaderIndex]!;
  if (leader.id !== leaderId) {
    return "Only the current leader can propose a team";
  }

  const requiredSize = getRequiredTeamSize(
    game.players.length,
    game.questIndex + 1,
  );
  if (teamMemberIds.length !== requiredSize) {
    return `Team must have exactly ${requiredSize} members`;
  }

  const proposedMembersAreValid = teamMemberIds.every((id) =>
    game.players.some((p) => p.id === id)
  );
  if (!proposedMembersAreValid) {
    return "Team contains invalid player IDs";
  }

  return null;
};

/**
 * Proposes a team for the current quest.
 * Moves the game to the voting stage and stores the proposal.
 * Assumes the proposal has been validated.
 */
export const proposeTeam = (
  game: Game,
  leaderId: string,
  teamMemberIds: string[],
): Game => {
  const proposal = {
    leaderId,
    teamMemberIds,
    votes: {},
  };

  const quest = game.quests[game.questIndex]!;
  const allAccept = game.players.reduce((acc, player) => {
    acc[player.id] = true;
    return acc;
  }, {} as Record<string, boolean>);
  const updatedQuest: Quest = quest.teamProposals.length === 4
    ? {
      ...quest,
      stage: "questing", // The 5th proposal is automatically accepted
      teamProposals: [...quest.teamProposals, {
        ...proposal,
        votes: allAccept,
      }],
    }
    : {
      ...quest,
      stage: "voting",
      teamProposals: [...quest.teamProposals, proposal],
    };

  return {
    ...game,
    quests: game.quests.map((q, index) =>
      index === game.questIndex ? updatedQuest : q
    ),
  };
};
