import type { VNode } from "preact";
import { Card } from "../components/Card.tsx";
import { Error } from "../components/Error.tsx";
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
      <h2 class="text-xl font-semibold text-primary mb-4">Game Complete</h2>
      <p class="text-secondary">Game complete phase - to be implemented</p>
    </Card>
  );
};
