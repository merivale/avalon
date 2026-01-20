import type { Game, Player, Quest, TeamProposal } from "@/core/types.ts";

export const createTestPlayer = (overrides?: Partial<Player>): Player => ({
  id: "player-1",
  displayName: "Test Player",
  ...overrides,
});

export const createTestQuest = (overrides?: Partial<Quest>): Quest => ({
  stage: "not-started",
  fails: 0,
  teamProposals: [],
  votes: {},
  ...overrides,
});

export const createTestTeamProposal = (
  overrides?: Partial<TeamProposal>,
): TeamProposal => ({
  leaderId: "player-1",
  teamMemberIds: ["player-1"],
  votes: {},
  ...overrides,
});

export const createTestGame = (overrides?: Partial<Game>): Game => ({
  id: "game-1",
  stage: "preparing",
  players: [],
  roleAssignments: {},
  leaderIndex: 0,
  questIndex: 0,
  quests: [
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
    createTestQuest(),
  ],
  assassinationTargetId: null,
  ...overrides,
});
