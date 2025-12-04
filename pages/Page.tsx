import type { ComponentChildren, VNode } from "preact";
import type { Player } from "@/core/types.ts";
import { Container } from "@/components/Container.tsx";
import { Input } from "@/components/Input.tsx";

type PageProps = {
  children: ComponentChildren;
  player: Player;
};

export const Page = ({ children, player }: PageProps): VNode => {
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
        <header class="bg-white border-b shadow p-4">
          <Container>
            <div class="flex items-center justify-between gap-6 flex-wrap">
              <h1 class="text-2xl font-bold text-primary">
                <a href="/" class="link">Avalon</a>
              </h1>
            <div class="flex flex-col items-end gap-2">
              <div class="flex items-center gap-2 py-2 px-4 bg-gray-50 rounded">
                <span class="text-secondary text-sm">Playing as:</span>
                <span class="font-semibold text-primary">{player.displayName}</span>
              </div>
              <form method="post" action="/update-name" class="flex gap-2">
                <Input
                  type="text"
                  name="displayName"
                  placeholder="Change your name"
                  required
                  maxLength={20}
                  class="input-sm w-45"
                />
                <button type="submit" class="btn-sm bg-slate-600 text-white rounded transition-colors bg-slate-900">Update</button>
              </form>
            </div>
            </div>
          </Container>
        </header>
        <main>
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
};
