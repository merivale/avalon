import type { Player } from "@/core/types.ts";

export type Handler = (
  { request, match, player }: HandlerArgs,
) => Promise<Response> | Response;

export type HandlerArgs = {
  request: Request;
  match: URLPatternResult;
  player: Player;
};

export type Route = { pattern: URLPattern; handler: Handler; method?: string };

export type Connection = {
  controller: Controller;
  playerId: string;
};

export type Controller = ReadableStreamDefaultController<Uint8Array>;
