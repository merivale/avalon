export const getPlayerId = (request: Request): string => {
  const urlSearchParams = new URL(request.url).searchParams;
  let playerIdParam = urlSearchParams.get("playerId");

  // If not in current URL, check referer (for form submissions)
  if (!playerIdParam) {
    const referer = request.headers.get("Referer");
    if (referer) {
      const refererUrl = new URL(referer);
      playerIdParam = refererUrl.searchParams.get("playerId");
    }
  }

  return playerIdParam ?? getPlayerIdFromCookie(request);
};

export const setPlayerIdCookie = (
  response: Response,
  playerId: string,
): Response => {
  const newResponse = new Response(response.body, response);
  newResponse.headers.set(
    "Set-Cookie",
    `playerId=${playerId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
  );
  return newResponse;
};

const getPlayerIdFromCookie = (request: Request): string => {
  const cookieHeader = request.headers.get("cookie");
  const cookies = cookieHeader?.split(";").map((c) => c.trim()) ?? [];
  const playerIdCookie = cookies.find((c) => c.startsWith("playerId="));
  return playerIdCookie ? playerIdCookie.split("=")[1]! : crypto.randomUUID();
};
