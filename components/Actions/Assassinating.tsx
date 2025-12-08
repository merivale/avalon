import Card from "@/components/Card.tsx";
import type { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default (_props: Props): VNode => {
  return (
    <Card class="grid-span-2">
      TODO
    </Card>
  );
};
