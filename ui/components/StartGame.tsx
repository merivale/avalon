import type { Game } from "@/core/types.ts";
import Button from "@/ui/elements/Button.tsx";
import Card from "@/ui/elements/Card.tsx";
import Error from "@/ui/elements/Error.tsx";
import Input from "@/ui/elements/Input.tsx";

type Props = {
  game: Game;
  error: string | null;
};

export default ({ game, error }: Props) => {
  return (
    <Card class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Start Game</h2>
      {game.players.length < 5
        ? <p>At least 5 players are required to start the game.</p>
        : <p>Choose special roles to start the game.</p>}
      {error && <Error message={error} />}
      <form
        method="post"
        action={`/game/${game.id}/start`}
        class="h-full flex flex-col gap-4 justify-between"
      >
        <div>
          <Input
            type="checkbox"
            name="merlin"
            label="Merlin (Good) - knows evil players"
          />
          <Input
            type="checkbox"
            name="percival"
            label="Percival (Good) - knows who Merlin is"
          />
          <Input
            type="checkbox"
            name="mordred"
            label="Mordred (Evil) - hidden from Merlin"
          />
          <Input
            type="checkbox"
            name="morgana"
            label="Morgana (Evil) - appears as Merlin to Percival"
          />
          <Input
            type="checkbox"
            name="oberon"
            label="Oberon (Evil) - unknown to other evil players"
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
  );
};
