import type { VNode } from "preact";
import { Button } from "../components/Button.tsx";
import { Card } from "../components/Card.tsx";
import { Input } from "../components/Input.tsx";
import { Error } from "../components/Error.tsx";
import { Game, Player } from "../core/types.ts";

type Props = {
  game: Game;
  player: Player;
  error: string | null;
};

export default ({ game, player, error }: Props): VNode => {
  return (
    <div class="max-w-5xl w-full">
      <Error message={error} />
      <div class="flex gap-6">
        <Card class="flex-1">
          <h2 class="text-xl font-semibold text-primary mb-4">Players in Game</h2>
          <ul class="flex flex-col gap-2">
            {game.players.map((player) => (
              <li key={player.id} class="p-3 bg-gray-50 rounded">{player.displayName}</li>
            ))}
          </ul>
          {!game.players.some((p) => p.id === player.id) && (
            <form method="post" action={`/join-game`} class="mt-4">
              <input type="hidden" name="gameId" value={game.id} />
              <Button type="submit">Join Game</Button>
            </form>
          )}
        </Card>
        
        <Card class="flex-1">
          <h2 class="text-xl font-semibold text-primary mb-4">Start Game</h2>
          {game.players.length < 5 && (
            <p class="text-sm text-secondary mb-4">Need at least 5 players to start the game</p>
          )}
          <form method="post" action={`/game/${game.id}/start`} class="flex flex-col gap-4">
            <fieldset disabled={game.players.length < 5} class="flex flex-col gap-3">
              <Input type="checkbox" name="merlin" value="true" label="Merlin (Good)" />
              <Input type="checkbox" name="percival" value="true" label="Percival (Good)" />
              <Input type="checkbox" name="assassin" value="true" label="Assassin (Evil)" />
              <Input type="checkbox" name="mordred" value="true" label="Mordred (Evil)" />
              <Input type="checkbox" name="morgana" value="true" label="Morgana (Evil)" />
              <Input type="checkbox" name="oberon" value="true" label="Oberon (Evil)" />
            </fieldset>
            <Button type="submit" disabled={game.players.length < 5} class="mt-2">Start Game</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
