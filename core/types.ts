// player
export type Player = {
  id: string;
  displayName: string;
};

// game options
export type GameOptions = {
  merlin: boolean;
  percival: boolean;
  mordred: boolean;
  morgana: boolean;
  oberon: boolean;
};

// game state
export type Game = {
  id: string;
  stage: GameStage;
  players: Player[];
  roleAssignments: Record<string, Role>;
  leaderIndex: number;
  questIndex: number;
  quests: Quest[];
  assassinationTargetId: string | null;
};

// game stage
export type GameStage =
  | "preparing"
  | "playing"
  | "assassination"
  | "good-wins"
  | "evil-wins-by-quests"
  | "evil-wins-by-assassination";

// roles
export const specialRoles = [
  "merlin",
  "percival",
  "mordred",
  "morgana",
  "oberon",
] as const;

export type SpecialRole = typeof specialRoles[number];

export type Role = SpecialRole | "servant" | "minion";

// quests
export type Quest = {
  stage: QuestStage;
  teamProposals: TeamProposal[];
  votes: Record<string, boolean>;
};

export type QuestStage =
  | "team-building"
  | "voting"
  | "questing"
  | "success"
  | "failure";

export type TeamProposal = {
  leaderId: string;
  teamMemberIds: string[];
  votes: Record<string, boolean>;
};
