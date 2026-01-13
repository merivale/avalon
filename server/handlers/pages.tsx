import Page from "@/client/Page.tsx";
import { getGame } from "@/server/persistence/database.ts";
import type { HandlerArgs } from "@/server/types.ts";
import { htmlResponse } from "@/server/utils/response.ts";
import Game from "@/ui/Game.tsx";
import Index from "@/ui/Index.tsx";
import NotFound from "@/ui/NotFound.tsx";

export const handleIndex = ({ request, player }: HandlerArgs) => {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  return htmlResponse(
    <Page player={player}>
      <Index error={error} />
    </Page>,
  );
};

export const handleGame = async (
  { match, player, request }: HandlerArgs,
) => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);
  if (!game) {
    return htmlResponse(<NotFound />, 404);
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  return htmlResponse(
    <Page player={player}>
      <Game game={game} player={player} error={error} />
    </Page>,
  );
};

export const handleNotFound = () => htmlResponse(<NotFound />, 404);
