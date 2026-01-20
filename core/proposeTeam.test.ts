import { proposeTeam, validateProposeTeam } from "@/core/proposeTeam.ts";
import {
  createTestGame,
  createTestPlayer,
  createTestQuest,
} from "@/core/testUtils.ts";
import type { Game } from "@/core/types.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

const createTestPlayingGame = (overrides?: Partial<Game>): Game => ({
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
    createTestQuest({ stage: "team-building" }),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
  ],
  assassinationTargetId: null,
  ...overrides,
});

describe("validateProposeTeam", () => {
  it("returns null when all conditions are met", () => {
    const game = createTestPlayingGame();
    const result = validateProposeTeam(game, "player-1", [
      "player-1",
      "player-2",
    ]);
    assertEquals(result, null);
  });

  it("returns error when game is not in playing stage", () => {
    const game = createTestPlayingGame({ stage: "preparing" });
    const result = validateProposeTeam(game, "player-1", [
      "player-1",
      "player-2",
    ]);
    assertEquals(
      result,
      "Teams can only be proposed during the team-building stage",
    );
  });

  it("returns error when quest is not in team-building stage", () => {
    const game = createTestPlayingGame();
    const quest = createTestQuest({ stage: "voting" });
    const updatedGame = {
      ...game,
      quests: [quest, ...game.quests.slice(1)],
    };
    const result = validateProposeTeam(updatedGame, "player-1", [
      "player-1",
      "player-2",
    ]);
    assertEquals(
      result,
      "Teams can only be proposed during the team-building stage",
    );
  });

  it("returns error when 5 proposals already exist", () => {
    const quest = createTestQuest({
      stage: "team-building",
      teamProposals: [
        {
          leaderId: "player-1",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-2",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-3",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-4",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-5",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
      ],
    });
    const game = createTestPlayingGame({
      quests: [
        quest,
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = validateProposeTeam(game, "player-1", [
      "player-1",
      "player-2",
    ]);
    assertEquals(
      result,
      "Maximum of 5 team proposals reached for this quest",
    );
  });

  it("returns error when player is not the current leader", () => {
    const game = createTestPlayingGame();
    const result = validateProposeTeam(game, "player-2", [
      "player-1",
      "player-2",
    ]);
    assertEquals(result, "Only the current leader can propose a team");
  });

  it("returns error when team size is incorrect", () => {
    const game = createTestPlayingGame();
    const result = validateProposeTeam(game, "player-1", ["player-1"]);
    assertEquals(result, "Team must have exactly 2 members");
  });

  it("returns error when team contains invalid player IDs", () => {
    const game = createTestPlayingGame();
    const result = validateProposeTeam(game, "player-1", [
      "player-1",
      "player-99",
    ]);
    assertEquals(result, "Team contains invalid player IDs");
  });
});

describe("proposeTeam", () => {
  it("adds proposal and moves to voting stage", () => {
    const game = createTestPlayingGame();
    const result = proposeTeam(game, "player-1", ["player-1", "player-2"]);
    assertEquals(result.quests[0]!.stage, "voting");
    assertEquals(result.quests[0]!.teamProposals.length, 1);
    assertEquals(result.quests[0]!.teamProposals[0]!.leaderId, "player-1");
    assertEquals(result.quests[0]!.teamProposals[0]!.teamMemberIds, [
      "player-1",
      "player-2",
    ]);
  });

  it("sets votes to empty object for non-fifth proposal", () => {
    const game = createTestPlayingGame();
    const result = proposeTeam(game, "player-1", ["player-1", "player-2"]);
    assertEquals(result.quests[0]!.teamProposals[0]!.votes, {});
  });

  it("automatically accepts 5th proposal and moves to questing", () => {
    const quest = createTestQuest({
      stage: "team-building",
      teamProposals: [
        {
          leaderId: "player-1",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-2",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-3",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-4",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
      ],
    });
    const game = createTestPlayingGame({
      quests: [
        quest,
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = proposeTeam(game, "player-1", ["player-1", "player-2"]);
    assertEquals(result.quests[0]!.stage, "questing");
    assertEquals(result.quests[0]!.teamProposals.length, 5);
  });

  it("sets all players to accept for 5th proposal", () => {
    const quest = createTestQuest({
      stage: "team-building",
      teamProposals: [
        {
          leaderId: "player-1",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-2",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-3",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
        {
          leaderId: "player-4",
          teamMemberIds: ["player-1", "player-2"],
          votes: {},
        },
      ],
    });
    const game = createTestPlayingGame({
      quests: [
        quest,
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
        createTestQuest(),
      ],
    });
    const result = proposeTeam(game, "player-1", ["player-1", "player-2"]);
    assertEquals(result.quests[0]!.teamProposals[4]!.votes, {
      "player-1": true,
      "player-2": true,
      "player-3": true,
      "player-4": true,
      "player-5": true,
    });
  });

  it("preserves other quests", () => {
    const game = createTestPlayingGame();
    const result = proposeTeam(game, "player-1", ["player-1", "player-2"]);
    assertEquals(result.quests.length, 5);
    assertEquals(result.quests[1], game.quests[1]);
    assertEquals(result.quests[2], game.quests[2]);
  });

  it("preserves other game state", () => {
    const game = createTestPlayingGame();
    const result = proposeTeam(game, "player-1", ["player-1", "player-2"]);
    assertEquals(result.id, game.id);
    assertEquals(result.stage, game.stage);
    assertEquals(result.players, game.players);
    assertEquals(result.leaderIndex, game.leaderIndex);
    assertEquals(result.questIndex, game.questIndex);
  });
});
