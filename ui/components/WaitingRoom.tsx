import type { Game, Player } from "@/core/types.ts";
import Button from "@/ui/elements/Button.tsx";
import Card from "@/ui/elements/Card.tsx";

type Props = {
  game: Game;
  player: Player;
};

export default ({ game, player }: Props) => {
  return (
    <Card class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Game Id</h2>
      <code class="bg-light-gray py-2 px-4 rounded">{game.id}</code>
      <h2 class="text-xl font-bold">Players in Game</h2>
      <ul class="flex flex-col gap-2">
        {game.players.map((player) => (
          <li key={player.id} class="bg-light-gray py-2 px-4">
            {player.displayName}
          </li>
        ))}
      </ul>
      {!game.players.some((p) => p.id === player.id) && (
        <form method="post" action={`/join-game`} class="flex justify-end">
          <input type="hidden" name="gameId" value={game.id} />
          <Button type="submit">Join Game</Button>
        </form>
      )}
    </Card>
  );
};
