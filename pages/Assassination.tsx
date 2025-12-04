import type { VNode } from "preact";
import { Card } from "../components/Card.tsx";
import { Error } from "../components/Error.tsx";
import { PlayerList } from "../components/PlayerList.tsx";
import { Game, Player } from "../core/types.ts";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  return (
    <Card class="max-w-md w-full">
      <Error message={error} />
      <h2 class="text-xl font-semibold text-primary mb-4">Quests Over</h2>
      <div class="flex flex-col gap-4">
        <PlayerList game={game} player={player} />
        <p class="text-secondary">Quests over phase - to be implemented</p>
      </div>
    </Card>
  );
};
