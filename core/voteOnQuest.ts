import type { Game, Quest } from "@/core/types.ts";

/**
 * Validates if a player can vote on the current team proposal.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateVoteOnQuest = (
  game: Game,
  playerId: string,
): string | null => {
  const quest = game.quests[game.questIndex];
  if (!quest || quest.stage !== "questing") {
    return "Quest votes can only be cast during the questing stage";
  }

  const currentProposal = quest.teamProposals[quest.teamProposals.length - 1];
  if (!currentProposal.teamMemberIds.includes(playerId)) {
    return "Player is not on the quest team";
  }

  if (playerId in quest.votes) {
    return "Player has already voted on this quest";
  }

  return null;
};

/**
 * Records a player's vote on the current quest and advances game state if all votes are in.
 * Assumes the vote has been validated.
 *
 * If all team members have voted:
 * - If majority succeed: quest is successful
 * - If enough fail votes: quest fails
 */
export const voteOnQuest = (
  game: Game,
  playerId: string,
  succeed: boolean,
): Game => {
  const quest = game.quests[game.questIndex];

  // Record the vote
  const updatedVotes = { ...quest.votes, [playerId]: succeed };

  // If votes are still pending, just update the quest
  if (
    Object.keys(updatedVotes).length < quest.teamProposals[
      quest.teamProposals.length - 1
    ].teamMemberIds.length
  ) {
    const updatedQuest: Quest = {
      ...quest,
      votes: updatedVotes,
    };
    return {
      ...game,
      quests: game.quests.with(game.questIndex, updatedQuest),
    };
  }

  // All votes are in - determine quest outcome
  const failVotes = Object.values(updatedVotes).filter((v) => !v).length;
  const requiredFails = game.playerIds.length >= 7 && game.questIndex === 3
    ? 2
    : 1;
  const questSucceeded = failVotes < requiredFails;
  const updatedQuest: Quest = {
    ...quest,
    stage: questSucceeded ? "success" : "failure",
    votes: updatedVotes,
  };
  const updatedQuests = game.quests.with(game.questIndex, updatedQuest);

  // Check for victory by evil team
  const failedQuests = updatedQuests.filter((q) => q.stage === "failure").length;
  if (failedQuests >= 3) {
    return {
      ...game,
      quests: updatedQuests,
      stage: "evil-wins-by-quests",
    };
  }

  // Check for victory by good team
  const successfulQuests = updatedQuests.filter((q) => q.stage === "success").length;
  if (successfulQuests >= 3) {
    // If Merlin is not in play, good team wins immediately
    const merlinInPlay = Object.values(game.roleAssignments).includes("merlin");
    if (!merlinInPlay) {
      return {
        ...game,
        quests: updatedQuests,
        stage: "good-wins",
      };
    }

    // Otherwise, move to assassination stage
    return {
      ...game,
      quests: updatedQuests,
      stage: "assassination",
    };
  }

  // No victory yet, proceed to next quest with next leader
  return {
    ...game,
    leaderIndex: (game.leaderIndex + 1) % game.playerIds.length,
    questIndex: game.questIndex + 1,
    quests: game.quests.with(game.questIndex, updatedQuest),
  };
};
