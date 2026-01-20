import {
  createTestGame,
  createTestPlayer,
  createTestQuest,
  createTestTeamProposal,
} from "@/core/testUtils.ts";
import type { Game } from "@/core/types.ts";
import { validateVoteOnTeam, voteOnTeam } from "@/core/voteOnTeam.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

const createTestVotingGame = (overrides?: Partial<Game>): Game => ({
  ...createTestGame(),
  stage: "playing",
  players: [
    createTestPlayer({ id: "player-1" }),
    createTestPlayer({ id: "player-2" }),
    createTestPlayer({ id: "player-3" }),
    createTestPlayer({ id: "player-4" }),
    createTestPlayer({ id: "player-5" }),
  ],
  roleAssignments: {
    "player-1": "merlin",
    "player-2": "minion",
    "player-3": "servant",
    "player-4": "servant",
    "player-5": "minion",
  },
  quests: [
    createTestQuest({
      stage: "voting",
      teamProposals: [
        createTestTeamProposal({
          leaderId: "player-1",
          teamMemberIds: ["player-1", "player-2"],
        }),
      ],
    }),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
  ],
  assassinationTargetId: null,
  ...overrides,
});

describe("validateVoteOnTeam", () => {
  it("returns null when quest is in voting stage and player hasn't voted", () => {
    const game = createTestVotingGame();
    const result = validateVoteOnTeam(game, "player-1");
    assertEquals(result, null);
  });

  it("returns error when quest is not in voting stage", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({ stage: "team-building" }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = validateVoteOnTeam(game, "player-1");
    assertEquals(result, "Votes can only be cast during the voting stage");
  });

  it("returns error when player ID is invalid", () => {
    const game = createTestVotingGame();
    const result = validateVoteOnTeam(game, "player-99");
    assertEquals(result, "Invalid player ID");
  });

  it("returns error when no team proposal exists", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({ stage: "voting" }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = validateVoteOnTeam(game, "player-1");
    assertEquals(result, "No team proposal to vote on");
  });

  it("returns error when player has already voted", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
              votes: { "player-1": true },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = validateVoteOnTeam(game, "player-1");
    assertEquals(result, "Player has already voted on this proposal");
  });
});

describe("voteOnTeam", () => {
  it("records vote when not all votes are in", () => {
    const game = createTestVotingGame();
    const result = voteOnTeam(game, "player-1", true);
    assertEquals(result.quests[0]!.teamProposals[0]!.votes["player-1"], true);
    assertEquals(result.quests[0]!.stage, "voting");
  });

  it("moves to questing when team is approved by majority", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
              votes: {
                "player-1": true,
                "player-2": true,
                "player-3": true,
                "player-4": false,
              },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnTeam(game, "player-5", true);
    assertEquals(result.quests[0]!.stage, "questing");
    assertEquals(result.leaderIndex, game.leaderIndex);
  });

  it("moves to team-building when team is rejected by majority", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
              votes: {
                "player-1": true,
                "player-2": false,
                "player-3": false,
                "player-4": false,
              },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnTeam(game, "player-5", false);
    assertEquals(result.quests[0]!.stage, "team-building");
  });

  it("advances leader when team is rejected", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
              votes: {
                "player-1": true,
                "player-2": false,
                "player-3": false,
                "player-4": false,
              },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnTeam(game, "player-5", false);
    assertEquals(result.leaderIndex, 1);
  });

  it("wraps leader index around to 0 after last player", () => {
    const game = createTestVotingGame({
      leaderIndex: 4,
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-5",
              teamMemberIds: ["player-1", "player-2"],
              votes: {
                "player-1": true,
                "player-2": false,
                "player-3": false,
                "player-4": false,
              },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnTeam(game, "player-5", false);
    assertEquals(result.leaderIndex, 0);
  });

  it("approves team on tie with odd number of players", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
              votes: {
                "player-1": true,
                "player-2": true,
                "player-3": false,
                "player-4": false,
              },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnTeam(game, "player-5", false);
    assertEquals(result.quests[0]!.stage, "team-building");
  });

  it("preserves proposal votes after voting completes", () => {
    const game = createTestVotingGame({
      quests: [
        createTestQuest({
          stage: "voting",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
              votes: {
                "player-1": true,
                "player-2": true,
                "player-3": true,
                "player-4": false,
              },
            }),
          ],
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnTeam(game, "player-5", false);
    assertEquals(
      Object.keys(result.quests[0]!.teamProposals[0]!.votes).length,
      5,
    );
    assertEquals(result.quests[0]!.teamProposals[0]!.votes["player-5"], false);
  });

  it("preserves other game state", () => {
    const game = createTestVotingGame();
    const result = voteOnTeam(game, "player-1", true);
    assertEquals(result.id, game.id);
    assertEquals(result.stage, game.stage);
    assertEquals(result.players, game.players);
    assertEquals(result.roleAssignments, game.roleAssignments);
    assertEquals(result.questIndex, game.questIndex);
  });
});
