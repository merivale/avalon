import type { Player } from "@/core/types.ts";
import Button from "@/ui/elements/Button.tsx";
import Container from "@/ui/elements/Container.tsx";
import Input from "@/ui/elements/Input.tsx";
import type { ComponentChildren, VNode } from "preact";

type Page = {
  children: ComponentChildren;
  player: Player;
};

export default ({ children, player }: Page): VNode => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Avalon</title>
        <link rel="stylesheet" href="/assets/styles.css" />
        <script src="/assets/main.js" defer></script>
      </head>
      <body>
        <header class="bg-white shadow">
          <Container class="items-center">
            <h1 class="text-2xl font-bold w-full">
              <a href="/">Avalon</a>
            </h1>
            <form
              class="flex gap justify-end"
              method="post"
              action="/update-name"
            >
              <Input
                label="Name"
                type="text"
                name="displayName"
                placeholder="anonymous"
                value={player.displayName}
                required
                maxLength={20}
              />
              <Button>Update</Button>
            </form>
          </Container>
        </header>
        <main>
          <Container id="content">{children}</Container>
        </main>
      </body>
    </html>
  );
};
