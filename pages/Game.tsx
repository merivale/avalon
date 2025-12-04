import type { VNode } from "preact";
import { Game, Player } from "../core/types.ts";
import Preparing from "./Preparing.tsx";
import Playing from "./Playing.tsx";
import Assassination from "./Assassination.tsx";
import GameComplete from "./GameComplete.tsx";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default (props: Props): VNode => {
  switch (props.game.stage) {
    case "preparing":
      return <Preparing {...props} />;
    case "playing":
      return <Playing {...props} />
    case "assassination":
      return <Assassination {...props} />
    case "good-wins":
    case "evil-wins-by-quests":
    case "evil-wins-by-assassination":
      return <GameComplete {...props} />
  }
};
