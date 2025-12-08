import Card from "@/components/Card.tsx";
import type { Game, Quest, QuestStage } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
};

export default ({ game }: Props): VNode => {
  return (
    <Card class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Quests</h2>
      <ul class="flex flex-col gap-2">
        {game.quests.map((quest, index) => (
          <li key={index} class="flex gap-2 bg-light-gray p-2">
            <span>{questIcon[quest.stage]}</span>
            <span>Quest {index + 1}:</span>
            <span>{questMessage(game, quest)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const questIcon: Record<QuestStage, string> = {
  "not-started": "🕒",
  "team-building": "👥",
  voting: "🗳️",
  questing: "🏹",
  success: "✅",
  failure: "❌",
};

const questMessage = (game: Game, quest: Quest): string => {
  const leader = game.players[game.leaderIndex]!;
  const proposal = quest.teamProposals.at(-1);
  const teamMembers =
    proposal?.teamMemberIds.map((id) =>
      game.players.find((p) => p.id === id)!
    ) ?? [];

  switch (quest.stage) {
    case "not-started":
      return "...";
    case "team-building":
      return `${leader.displayName} is proposing a team...`;
    case "voting":
      return `${leader.displayName} has proposed ${
        teamMembers.map((p) => p.displayName).join(", ")
      }...`;
    case "questing":
      return `${
        teamMembers.map((p) => p.displayName).join(", ")
      } are going on the quest...`;
    case "success":
      return `${teamMembers.map((p) => p.displayName).join(", ")}`;
    case "failure":
      return `${
        teamMembers.map((p) => p.displayName).join(", ")
      } (${quest.fails} fail${quest.fails === 1 ? "" : "s"})`;
  }
};
