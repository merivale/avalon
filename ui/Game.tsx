import type { Game, Player } from "@/core/types.ts";
import Action from "@/ui/components/Action.tsx";
import Players from "@/ui/components/Players.tsx";
import Quests from "@/ui/components/Quests.tsx";
import StartGame from "@/ui/components/StartGame.tsx";
import VotingHistory from "@/ui/components/VotingHistory.tsx";
import WaitingRoom from "@/ui/components/WaitingRoom.tsx";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  return game.stage === "preparing"
    ? (
      <>
        <WaitingRoom game={game} player={player} />
        <StartGame game={game} error={error} />
      </>
    )
    : (
      <>
        <Players game={game} player={player} />
        <Quests game={game} />
        <Action game={game} player={player} error={error} />
        <VotingHistory game={game} />
      </>
    );
};
