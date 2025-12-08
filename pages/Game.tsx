import Action from "@/components/Action.tsx";
import Players from "@/components/Players.tsx";
import Quests from "@/components/Quests.tsx";
import VotingHistory from "@/components/VotingHistory.tsx";
import { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  return (
    <>
      <Players game={game} player={player} />
      <Quests game={game} />
      <Action game={game} player={player} error={error} />
      <VotingHistory game={game} />
    </>
  );
};
