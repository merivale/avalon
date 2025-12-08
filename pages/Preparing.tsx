import Button from "@/components/Button.tsx";
import Card from "@/components/Card.tsx";
import Error from "@/components/Error.tsx";
import Input from "@/components/Input.tsx";
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
      <Card class="flex flex-col gap-4">
        <h2 class="text-xl font-bold">Players in Game</h2>
        <ul class="flex flex-col gap-2">
          {game.players.map((player) => (
            <li key={player.id} class="bg-light-gray py-1 px-2">
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
      <Card class="flex flex-col gap-4">
        {error && <Error message={error} />}
        <h2 class="text-xl font-bold">Start Game</h2>
        {game.players.length < 5
          ? <p>At least 5 players are required to start the game.</p>
          : <p>Choose special roles to start the game.</p>}
        <form
          method="post"
          action={`/game/${game.id}/start`}
          class="flex flex-col gap-4"
        >
          <div>
            <Input
              type="checkbox"
              name="merlin"
              label="Merlin (Good)"
            />
            <Input
              type="checkbox"
              name="percival"
              label="Percival (Good)"
            />
            <Input
              type="checkbox"
              name="mordred"
              label="Mordred (Evil)"
            />
            <Input
              type="checkbox"
              name="morgana"
              label="Morgana (Evil)"
            />
            <Input
              type="checkbox"
              name="oberon"
              label="Oberon (Evil)"
            />
          </div>
          <Button
            type="submit"
            disabled={game.players.length < 5}
            class="self-end"
          >
            Start Game
          </Button>
        </form>
      </Card>
    </>
  );
};
