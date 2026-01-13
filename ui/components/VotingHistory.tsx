import type { Game } from "@/core/types.ts";
import Card from "@/ui/elements/Card.tsx";
import Quest from "@/ui/components/VotingHistory/Quest.tsx";
import type { VNode } from "preact";

type Props = {
  game: Game;
};

export default ({ game }: Props): VNode => {
  const questsWithProposals = game.quests.filter((q) =>
    q.teamProposals.length > 0
  );

  return (
    <Card class="grid-span-2 flex flex-col gap-4">
      <h2 class="text-xl font-bold">Voting History</h2>
      {questsWithProposals.length === 0 && <p>No voting history yet.</p>}
      {questsWithProposals.map((quest, index) => (
        <Quest key={index} index={index} quest={quest} players={game.players} />
      ))}
    </Card>
  );
};
