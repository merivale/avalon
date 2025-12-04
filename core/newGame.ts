import type { Game } from "@/core/types.ts";

export default (): Game => ({
    id: crypto.randomUUID(),
    stage: "preparing",
    playerIds: [],
    roleAssignments: {},
    leaderIndex: 0,
    questIndex: 0,
    quests: [],
    assassinationTargetId: null,
});
