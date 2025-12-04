import type { VNode } from "preact";
import type { Game, Player, Role } from "@/core/types.ts";

type Props = {
  game: Game;
  player: Player;
};

const visibleEvilRoles: Role[] = ["mordred", "morgana", "minion"];

const isVisibleEvil = (role: Role): boolean => {
  return visibleEvilRoles.includes(role);
};

export const PlayerList = ({ game, player }: Props): VNode => {
  const currentPlayerRole = game.roleAssignments[player.id];
  const currentPlayerCanSeeEvil = isVisibleEvil(currentPlayerRole);

  return (
    <div class="bg-gray-50 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-secondary mb-3">Players</h3>
      <div class="mb-3 px-3 py-2 bg-primary text-white rounded font-semibold text-sm">
        Your role:{" "}
        {currentPlayerRole.charAt(0).toUpperCase() + currentPlayerRole.slice(1)}
      </div>
      <div class="flex flex-col gap-2">
        {game.players.map((p, index) => {
          const isLeader = game.leaderIndex === index;
          const playerRole = game.roleAssignments[p.id];
          const isEvilPlayer = currentPlayerCanSeeEvil &&
            p.id !== player.id &&
            isVisibleEvil(playerRole);

          return (
            <div
              key={p.id}
              class={`flex items-center gap-2 px-3 py-2 rounded ${
                isLeader ? "bg-primary text-white font-semibold" : "bg-white"
              }`}
            >
              {isLeader && <span class="text-sm">👑</span>}
              <span class={isLeader ? "" : "text-primary"}>
                {p.displayName}
              </span>
              {isEvilPlayer && (
                <span class="ml-auto text-red-600 text-sm font-semibold">
                  EVIL
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
