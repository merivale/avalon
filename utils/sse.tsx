import { renderToString } from "preact-render-to-string";
import type { Game } from "@/core/types.ts";
import GamePage from "@/pages/Game.tsx";
import Preparing from "@/pages/Preparing.tsx";
import type { Connection, Controller } from "@/handlers/types.ts";

// Create an SSE stream for a given game ID
export const createSSEStream = (gameId: string, playerId: string): Response => {
  let controller: Controller;
  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      registerConnection(gameId, playerId, controller);

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
export const broadcastGameUpdate = (game: Game): void => {
  const connections = gameConnections.get(game.id);
  if (!connections) return;

  for (const connection of connections) {
    try {
      const player = game.players.find((p) => p.id === connection.playerId);
      if (!player) continue; // Player not in game

      const content = game.stage === "preparing"
        ? <Preparing game={game} player={player} error={null} />
        : <GamePage game={game} player={player} error={null} />;
      connection.controller.enqueue(textEncoder.encode(`data: ${renderToString(content)}\n\n`));
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
