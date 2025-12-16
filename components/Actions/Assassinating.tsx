import Card from "@/components/Card.tsx";
import type { Game, Player } from "@/core/types.ts";
import Input from "@/components/Input.tsx";
import Error from "@/components/Error.tsx";
import type { VNode } from "preact";
import { isEvil } from "@/core/gameConfig.ts";
import Button from "../Button.tsx";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  const playerRole = game.roleAssignments[player.id]!;
  const playerIsEvil = isEvil(playerRole);
  const targets = game.players.filter((p) => p.id !== player.id);

  return (
    <Card class="grid-span-2 flex flex-col gap-4">
      {error && <Error message={error} />}
      {playerIsEvil
        ? (
          <>
            <h3 class="font-semibold">Assassinate Merlin</h3>
            <p>The loyal servants of Arthur have succeeded three quests. You now have an opportunity to assassinate Merlin.</p>
            <form
              method="POST"
              action={`/game/${game.id}/assassinate-merlin`}
              class="flex flex-col gap-4"
            >
              <div class="flex-1 flex gap-4 flex-wrap">
                {targets.map((player) => (
                  <Input
                    key={player.id}
                    label={player.displayName}
                    type="checkbox"
                    name={player.id}
                  />
                ))}
                <input
                  type="hidden"
                  name="player-ids"
                  value={targets.map((p) => p.id).join(",")}
                />
              </div>
              <Button class="self-end">Pull the Trigger</Button>
            </form>
          </>
        )
        : (
          <>
            <h3 class="font-semibold">Assassinate Merlin</h3>
            <p class="py-2">The loyal servants of Arthur have succeeded three quests. Waiting for evil players to try and assassinate Merlin...</p>
          </>
        )}
    </Card>
  );
};
