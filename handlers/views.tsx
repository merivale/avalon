import Page from "@/components/Page.tsx";
import handleNotFound from "@/handlers/notFound.tsx";
import type { HandlerArgs } from "@/handlers/types.ts";
import Game from "@/pages/Game.tsx";
import Index from "@/pages/Index.tsx";
import Preparing from "@/pages/Preparing.tsx";
import { getGame } from "@/utils/database.ts";
import { fileResponse, htmlResponse } from "@/utils/response.tsx";
import { createSSEStream } from "@/utils/sse.ts";

export const handleStylesheet = () =>
  fileResponse("./assets/styles.css", "text/css");

export const handleIndex = ({ request, player }: HandlerArgs) => {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  return htmlResponse(
    <Page player={player}>
      <Index error={error} />
    </Page>,
  );
};

export const handleGameView = async (
  { match, player, request }: HandlerArgs,
) => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);
  if (!game) {
    return handleNotFound();
  }

  const url = new URL(request.url);
  const error = url.searchParams.get("error");

  const content = game.stage === "preparing"
    ? <Preparing game={game} player={player} error={error} />
    : <Game game={game} player={player} error={error} />;

  return htmlResponse(<Page player={player}>{content}</Page>);
};

export const handleGameEvents = ({ match }: HandlerArgs) => {
  const gameId = match.pathname.groups.id!;
  return createSSEStream(gameId);
};
