import Assassinating from "@/components/Actions/Assassinating.tsx";
import Questing from "@/components/Actions/Questing.tsx";
import TeamBuilding from "@/components/Actions/TeamBuilding.tsx";
import Voting from "@/components/Actions/Voting.tsx";
import Card from "@/components/Card.tsx";
import type { Game, Player } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  switch (game.stage) {
    case "preparing":
      return <Card class="grid-span-2">Waiting for game to start...</Card>;
    case "playing": {
      const currentQuest = game.quests[game.questIndex]!;
      switch (currentQuest.stage) {
        case "team-building":
          return <TeamBuilding game={game} player={player} error={error} />;
        case "voting":
          return <Voting game={game} player={player} error={error} />;
        case "questing":
          return <Questing game={game} player={player} error={error} />;
        default: // any other stage should not be the active quest
          return <Card class="grid-span-2">Waiting for next action...</Card>;
      }
    }
    case "assassination":
      return <Assassinating game={game} player={player} error={error} />;
    case "good-wins":
      return <Card class="grid-span-2">Good team wins! 🎉</Card>;
    case "evil-wins-by-quests":
      return <Card class="grid-span-2">Evil team wins by quests! 🥳</Card>;
    case "evil-wins-by-assassination":
      return (
        <Card class="grid-span-2">Evil team wins by assassination! 🥳</Card>
      );
  }
};
