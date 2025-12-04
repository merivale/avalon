import type { VNode } from "preact";
import { Game, Player } from "../core/types.ts";
import Questing from "./Questing.tsx";
import TeamBuilding from "./Preparing.tsx";
import Voting from "./Voting.tsx";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default (props: Props): VNode => {
  const quest = props.game.quests[props.game.questIndex];
  switch (quest.stage) {
    case "team-building":
      return <TeamBuilding {...props} />;
    case "voting":
      return <Voting {...props} />
    case "questing":
      return <Questing {...props} />
  }
};
