import {
  createTestGame,
  createTestPlayer,
  createTestQuest,
  createTestTeamProposal,
} from "@/core/testUtils.ts";
import type { Game } from "@/core/types.ts";
import { validateVoteOnQuest, voteOnQuest } from "@/core/voteOnQuest.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

const createTestQuestingGame = (overrides?: Partial<Game>): Game => ({
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
  leaderIndex: 0,
  questIndex: 0,
  quests: [
    createTestQuest({
      stage: "questing",
      teamProposals: [
        {
          leaderId: "player-1",
          teamMemberIds: ["player-1", "player-2"],
          votes: {
            "player-1": true,
            "player-2": true,
            "player-3": true,
            "player-4": false,
            "player-5": false,
          },
        },
      ],
    }),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
  ],
  assassinationTargetId: null,
  ...overrides,
});

describe("validateVoteOnQuest", () => {
  it("returns null when player is on team and hasn't voted", () => {
    const game = createTestQuestingGame();
    const result = validateVoteOnQuest(game, "player-1");
    assertEquals(result, null);
  });

  it("returns error when quest is not in questing stage", () => {
    const game = createTestQuestingGame({
      quests: [
        createTestQuest({ stage: "team-building" }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = validateVoteOnQuest(game, "player-1");
    assertEquals(
      result,
      "Quest votes can only be cast during the questing stage",
    );
  });

  it("returns error when player is not on the quest team", () => {
    const game = createTestQuestingGame();
    const result = validateVoteOnQuest(game, "player-3");
    assertEquals(result, "Player is not on the quest team");
  });

  it("returns error when player has already voted", () => {
    const game = createTestQuestingGame({
      quests: [
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = validateVoteOnQuest(game, "player-1");
    assertEquals(result, "Player has already voted on this quest");
  });
});

describe("voteOnQuest", () => {
  it("records vote when not all votes are in", () => {
    const game = createTestQuestingGame();
    const result = voteOnQuest(game, "player-1", true);
    assertEquals(result.quests[0]!.votes["player-1"], true);
    assertEquals(result.quests[0]!.stage, "questing");
  });

  it("marks quest as success when all vote and enough succeed", () => {
    const game = createTestQuestingGame({
      quests: [
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", true);
    assertEquals(result.quests[0]!.stage, "success");
    assertEquals(result.quests[0]!.fails, 0);
  });

  it("marks quest as failure when enough fail votes", () => {
    const game = createTestQuestingGame({
      quests: [
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", false);
    assertEquals(result.quests[0]!.stage, "failure");
    assertEquals(result.quests[0]!.fails, 1);
  });

  it("moves to evil-wins-by-quests when 3 quests fail", () => {
    const game = createTestQuestingGame({
      questIndex: 2,
      quests: [
        createTestQuest({ stage: "failure", fails: 1 }),
        createTestQuest({ stage: "failure", fails: 1 }),
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", false);
    assertEquals(result.stage, "evil-wins-by-quests");
  });

  it("moves to assassination when 3 quests succeed with Merlin in play", () => {
    const game = createTestQuestingGame({
      questIndex: 2,
      quests: [
        createTestQuest({ stage: "success" }),
        createTestQuest({ stage: "success" }),
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", true);
    assertEquals(result.stage, "assassination");
  });

  it("moves to good-wins when 3 quests succeed without Merlin", () => {
    const game = createTestQuestingGame({
      questIndex: 2,
      roleAssignments: {
        "player-1": "servant",
        "player-2": "minion",
        "player-3": "servant",
        "player-4": "servant",
        "player-5": "minion",
      },
      quests: [
        createTestQuest({ stage: "success" }),
        createTestQuest({ stage: "success" }),
        createTestQuest({
          stage: "questing",
          fails: 0,
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", true);
    assertEquals(result.stage, "good-wins");
  });

  it("advances to next quest with next leader when no victory", () => {
    const game = createTestQuestingGame({
      quests: [
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-1",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", true);
    assertEquals(result.questIndex, 1);
    assertEquals(result.leaderIndex, 1);
    assertEquals(result.quests[1]!.stage, "team-building");
  });

  it("wraps leader index around to 0 after last player", () => {
    const game = createTestQuestingGame({
      leaderIndex: 4,
      quests: [
        createTestQuest({
          stage: "questing",
          teamProposals: [
            createTestTeamProposal({
              leaderId: "player-5",
              teamMemberIds: ["player-1", "player-2"],
            }),
          ],
          votes: { "player-1": true },
        }),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = voteOnQuest(game, "player-2", true);
    assertEquals(result.leaderIndex, 0);
  });

  it("preserves other game state", () => {
    const game = createTestQuestingGame();
    const result = voteOnQuest(game, "player-1", true);
    assertEquals(result.id, game.id);
    assertEquals(result.players, game.players);
    assertEquals(result.roleAssignments, game.roleAssignments);
  });
});
