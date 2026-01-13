import { handleNotFound } from "@/server/handlers/pages.tsx";
import routes from "@/server/routes.ts";
import { getOrCreatePlayer } from "@/server/persistence/database.ts";
import { getPlayerId, setPlayerIdCookie } from "@/server/utils/session.ts";

export default async (request: Request): Promise<Response> => {
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
