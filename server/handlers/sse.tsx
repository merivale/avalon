import type { Game } from "@/core/types.ts";
import { getPlayer } from "@/server/persistence/database.ts";
import type { Connection, Controller, HandlerArgs } from "@/server/types.ts";
import GamePage from "@/ui/Game.tsx";
import { renderToString } from "preact-render-to-string";

// Create an SSE stream for a given game ID
export const handleGameEvents = ({ match, player }: HandlerArgs) => {
  const gameId = match.pathname.groups.id!;

  let controller: Controller;
  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      registerConnection(gameId, player.id, controller);

      // Send initial comment to establish connection
      controller.enqueue(CONNECTED_MESSAGE);
    },
    cancel() {
      if (controller) {
        unregisterConnection(gameId, controller);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
};

// Broadcast an update message to all connected clients for a game
export const broadcastGameUpdate = async (game: Game): Promise<void> => {
  const connections = gameConnections.get(game.id);
  if (!connections) return;

  for (const connection of connections) {
    try {
      const player = await getPlayer(connection.playerId);
      if (!player) throw new Error("Player not found");

      const content = renderToString(
        <GamePage game={game} player={player} error={null} />,
      );
      connection.controller.enqueue(textEncoder.encode(`data: ${content}\n\n`));
    } catch {
      // Controller may be closed, remove it
      connections.delete(connection);
    }
  }
};

// Send heartbeats to all active connections and clean up closed ones
export const sendHeartbeat = (): void => {
  for (const [gameId, connections] of gameConnections) {
    for (const connection of connections) {
      try {
        connection.controller.enqueue(HEARTBEAT_MESSAGE);
      } catch {
        // Controller may be closed, remove it
        connections.delete(connection);
      }
    }
    // Clean up empty game connections
    if (connections.size === 0) {
      gameConnections.delete(gameId);
    }
  }
};

// Map of gameId -> Set of connected SSE connections
const gameConnections = new Map<string, Set<Connection>>();

// Text encoder and pre-encoded SSE messages
const textEncoder = new TextEncoder();
const CONNECTED_MESSAGE = textEncoder.encode(": connected\n\n");
const HEARTBEAT_MESSAGE = textEncoder.encode(": heartbeat\n\n");

// Register a new SSE connection for a game
const registerConnection = (
  gameId: string,
  playerId: string,
  controller: Controller,
): void => {
  if (!gameConnections.has(gameId)) {
    gameConnections.set(gameId, new Set());
  }
  gameConnections.get(gameId)!.add({ controller, playerId });
};

// Unregister an SSE connection for a game
const unregisterConnection = (
  gameId: string,
  controller: Controller,
): void => {
  const connections = gameConnections.get(gameId);
  if (connections) {
    for (const connection of connections) {
      if (connection.controller === controller) {
        connections.delete(connection);
        break;
      }
    }
    if (connections.size === 0) {
      gameConnections.delete(gameId);
    }
  }
};
