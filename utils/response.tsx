import type { ComponentChildren } from "preact";
import { renderToString } from "preact-render-to-string";

export const htmlResponse = (content: ComponentChildren): Response => {
  const html = "<!DOCTYPE html>" + renderToString(<>{content}</>);
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};

export const fileResponse = async (
  path: string,
  contentType = "application/octet-stream",
): Promise<Response> => {
  const file = await Deno.readFile(path);
  return new Response(file, {
    headers: { "Content-Type": contentType },
  });
};

export const redirectResponse = (
  location: string,
  request: Request,
): Response => {
  let finalLocation = location;

  // preserve playerId query param from request or referer URL
  const url = new URL(request.url);
  let playerIdParam = url.searchParams.get("playerId");
  if (!playerIdParam) {
    const referer = request.headers.get("Referer");
    if (referer) {
      const refererUrl = new URL(referer);
      playerIdParam = refererUrl.searchParams.get("playerId");
    }
  }
  if (playerIdParam) {
    const locationUrl = new URL(location, url);
    if (!locationUrl.searchParams.has("playerId")) {
      locationUrl.searchParams.set("playerId", playerIdParam);
      finalLocation = locationUrl.pathname +
        (locationUrl.searchParams.toString()
          ? `?${locationUrl.searchParams.toString()}`
          : "");
    }
  }

  return new Response(null, {
    status: 303,
    headers: { Location: finalLocation },
  });
};
