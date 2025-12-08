import Card from "@/components/Card.tsx";
import { getVisibleRoleForPlayer } from "@/core/gameConfig.ts";
import type { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
};

export default ({ game, player }: Props): VNode => {
  const currentPlayerRole = game.roleAssignments[player.id]!;
  const gameOver = [
    "good-wins",
    "evil-wins-by-quests",
    "evil-wins-by-assassination",
  ].includes(game.stage);

  return (
    <Card class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Players</h2>
      <ul class="flex flex-col gap-2">
        {game.players.map((p, index) => {
          const isLeader = game.leaderIndex === index;
          const role = game.roleAssignments[p.id]!;
          const visibleRole = gameOver
            ? role
            : getVisibleRoleForPlayer(role, currentPlayerRole);
          const roleDescription =
            roleDescriptions[p.id === player.id ? role : visibleRole];
          const roleIcon = p.id === player.id
            ? roleIcons[role]
            : roleIcons[visibleRole];

          return (
            <li
              key={p.id}
              class={`flex gap-2 ${isLeader ? "font-semibold" : ""}`}
            >
              <span class="cursor-pointer" title={roleDescription}>
                {roleIcon}
              </span>
              <span>{p.displayName} {isLeader && "⭐"}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

const roleDescriptions: Record<string, string> = {
  merlin: "Merlin",
  percival: "Percival",
  servant: "Loyal Servant of Arthur",
  morgana: "Morgana (poses as Merlin to Percival)",
  mordred: "Mordred (hidden from Merlin)",
  oberon: "Oberon (hidden from evil allies, but not from Merlin)",
  minion: "Minion of Mordred",
  unknown: "Unknown",
};

const roleIcons: Record<string, string> = {
  merlin: "🧙‍♂️",
  percival: "🧑‍✈️",
  servant: "🧑‍🌾",
  morgana: "🧙‍♀️",
  mordred: "🧛‍♂️",
  oberon: "🤴",
  minion: "👹",
  unknown: "❓",
};
