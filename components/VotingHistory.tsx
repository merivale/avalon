import Card from "@/components/Card.tsx";
import Quest from "@/components/VotingHistory/Quest.tsx";
import type { Game } from "@/core/types.ts";
import type { VNode } from "preact";

type Props = {
  game: Game;
};

export default ({ game }: Props): VNode => {
  return (
    <Card class="grid-span-2 flex flex-col gap-4">
      <h2 class="text-xl font-bold">Voting History</h2>
      {game.quests.filter((q) =>
        q.stage !== "not-started" && q.teamProposals.length > 0
      ).map((
        quest,
        index,
      ) => (
        <Quest key={index} index={index} quest={quest} players={game.players} />
      ))}
    </Card>
  );
};
