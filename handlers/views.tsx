import type { HandlerArgs } from "@/handlers/types.ts";
import handleNotFound from "@/handlers/notFound.tsx";
import Index from "@/pages/Index.tsx";
import Game from "@/pages/Game.tsx";
import { getGame } from "@/utils/database.ts";
import { fileResponse, htmlResponse } from "@/utils/response.tsx";
import { createSSEStream } from "@/utils/sse.ts";

export const handleStylesheet = () => 
  fileResponse("./assets/styles.css", "text/css");

export const handleIndex = ({ request, player }: HandlerArgs) => {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  return htmlResponse(<Index error={error} />, player);
};

export const handleGameView = async ({ match, player, request }: HandlerArgs) => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);
  if (!game) {
    return handleNotFound();
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  return htmlResponse(
    <Game game={game} player={player} error={error} />,
    player,
  );
};

export const handleGameEvents = ({ match }: HandlerArgs) => {
  const gameId = match.pathname.groups.id!;
  return createSSEStream(gameId);
};
