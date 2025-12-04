import handleNotFound from "@/handlers/notFound.tsx";
import routes from "@/handlers/routes.tsx";
import { getPlayerId, setPlayerIdCookie } from "@/utils/session.ts";
import { getOrCreatePlayer } from "./utils/database.ts";

const port = 8080;

const onListen = () => {
  console.log(`Server running on http://localhost:${port}`);
};

const router = async (request: Request): Promise<Response> => {
  const playerId = getPlayerId(request);
  const player = await getOrCreatePlayer(playerId);

  for (const route of routes) {
    const match = route.pattern.exec(request.url);
    if (match && (!route.method || route.method === request.method)) {
      const response = await route.handler({ request, match, player });
      return setPlayerIdCookie(response, playerId);
    }
  }
  const notFoundResponse = handleNotFound();
  return setPlayerIdCookie(notFoundResponse, playerId);
};

Deno.serve({ port, onListen }, router);
