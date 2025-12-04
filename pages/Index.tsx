import type { VNode } from "preact";
import { Button } from "@/components/Button.tsx";
import { Card } from "@/components/Card.tsx";
import { Input } from "@/components/Input.tsx";
import { Error } from "@/components/Error.tsx";

type IndexProps = {
  error: string | null;
};

export default ({ error }: IndexProps): VNode => {
  return (
    <Card class="max-w-md w-full">
      <Error message={error} />
      <div class="flex flex-col gap-6">
        <form method="post" action="/new-game">
          <Button type="submit" variant="primary">Create New Game</Button>
        </form>

        <div class="divider">
          <span>or</span>
        </div>

        <form method="post" action="/join-game" class="flex flex-col gap-3">
          <Input
            type="text"
            id="gameId"
            name="gameId"
            label="Game ID"
            required
          />
          <Button type="submit" variant="secondary">Join Game</Button>
        </form>
      </div>
    </Card>
  );
};
