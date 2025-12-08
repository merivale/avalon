import Button from "@/components/Button.tsx";
import Card from "@/components/Card.tsx";
import Error from "@/components/Error.tsx";
import Input from "@/components/Input.tsx";
import type { VNode } from "preact";

type IndexProps = {
  error: string | null;
};

export default ({ error }: IndexProps): VNode => {
  return (
    <Card class="grid-span-2 flex flex-col gap-4 items-center">
      {error && <Error message={error} />}
      <form method="post" action="/new-game">
        <Button>Create New Game</Button>
      </form>
      <form class="flex gap-4" method="post" action="/join-game">
        <Input
          type="text"
          id="gameId"
          name="gameId"
          label="Game ID"
          required
        />
        <Button color="green">Join Game</Button>
      </form>
    </Card>
  );
};
