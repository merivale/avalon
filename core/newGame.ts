import type { Game, Quest } from "@/core/types.ts";

export default (id?: string): Game => ({
  id: id ?? crypto.randomUUID(),
  stage: "preparing",
  players: [],
  roleAssignments: {},
  leaderIndex: 0,
  questIndex: 0,
  quests: Array(5).fill(createEmptyQuest()),
  assassinationTargetId: null,
});

const createEmptyQuest = (): Quest => ({
  stage: "not-started",
  fails: 0,
  teamProposals: [],
  votes: {},
});
