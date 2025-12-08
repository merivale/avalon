import Button from "@/components/Button.tsx";
import Container from "@/components/Container.tsx";
import Input from "@/components/Input.tsx";
import type { Player } from "@/core/types.ts";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Server-Sent Events for real-time game updates
              if (window.location.pathname.startsWith('/game/')) {
                const gameId = window.location.pathname.split('/')[2];
                const eventSource = new EventSource('/game/' + gameId + '/events');
                eventSource.onmessage = function(event) {
                  if (event.data === 'update') {
                    window.location.reload();
                  }
                };
                eventSource.onerror = function() {
                  eventSource.close();
                  setTimeout(function() { window.location.reload(); }, 3000);
                };
              }
            `,
          }}
        />
      </head>
      <body>
        <header class="bg-white shadow">
          <Container class="items-center">
            <h1 class="text-2xl font-bold">
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
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
};
