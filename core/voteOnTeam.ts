import type { Game, Quest } from "@/core/types.ts";

/**
 * Validates if a player can vote on the current team proposal.
 * Returns null if valid, or an error message string if invalid.
 */
export const validateVoteOnTeam = (
  game: Game,
  playerId: string,
): string | null => {
  const quest = game.quests[game.questIndex];
  if (!quest || quest.stage !== "voting") {
    return "Votes can only be cast during the voting stage";
  }

  if (!game.players.some((player) => player.id === playerId)) {
    return "Invalid player ID";
  }

  const currentProposal = quest.teamProposals[quest.teamProposals.length - 1];
  if (!currentProposal) {
    return "No team proposal to vote on";
  }

  if (playerId in currentProposal.votes) {
    return "Player has already voted on this proposal";
  }

  return null;
};

/**
 * Records a player's vote on the current team proposal and advances game state if all votes are in.
 * Assumes the vote has been validated.
 *
 * If all players have voted:
 * - If majority approve: moves to questing stage
 * - If majority reject: moves back to team-building with next leader
 */
export const voteOnTeam = (
  game: Game,
  playerId: string,
  approve: boolean,
): Game => {
  const quest = game.quests[game.questIndex]!;
  const proposalIndex = quest.teamProposals.length - 1;
  const currentProposal = quest.teamProposals[proposalIndex]!;

  // Record the vote in the proposal
  const updatedProposal = {
    ...currentProposal,
    votes: { ...currentProposal.votes, [playerId]: approve },
  };

  // If votes are still pending, just update the proposal
  if (Object.keys(updatedProposal.votes).length < game.players.length) {
    const updatedQuest: Quest = {
      ...quest,
      teamProposals: quest.teamProposals.with(proposalIndex, updatedProposal),
    };

    return {
      ...game,
      quests: game.quests.with(game.questIndex, updatedQuest),
    };
  }

  // If all votes are in, determine the outcome
  const approvals = Object.values(updatedProposal.votes).filter(Boolean).length;
  const rejections = game.players.length - approvals;

  // Team approved - move to questing stage
  if (approvals > rejections) {
    const updatedQuest: Quest = {
      ...quest,
      stage: "questing",
      teamProposals: quest.teamProposals.with(proposalIndex, updatedProposal),
    };

    return {
      ...game,
      quests: game.quests.with(game.questIndex, updatedQuest),
    };
  }

  // Team rejected - move back to team-building with next leader
  const nextLeaderIndex = (game.leaderIndex + 1) % game.players.length;
  const updatedQuest: Quest = {
    ...quest,
    stage: "team-building",
    teamProposals: quest.teamProposals.with(proposalIndex, updatedProposal),
  };

  return {
    ...game,
    leaderIndex: nextLeaderIndex,
    quests: game.quests.with(game.questIndex, updatedQuest),
  };
};
