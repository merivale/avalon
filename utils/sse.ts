// Server-Sent Events connection manager for game updates

type SSEController = ReadableStreamDefaultController<Uint8Array>;

// Map of gameId -> Set of connected SSE controllers
const gameConnections = new Map<string, Set<SSEController>>();

/**
 * Register a new SSE connection for a game
 */
export const registerConnection = (gameId: string, controller: SSEController): void => {
  if (!gameConnections.has(gameId)) {
    gameConnections.set(gameId, new Set());
  }
  gameConnections.get(gameId)!.add(controller);
};

/**
 * Unregister an SSE connection for a game
 */
export const unregisterConnection = (gameId: string, controller: SSEController): void => {
  const connections = gameConnections.get(gameId);
  if (connections) {
    connections.delete(controller);
    if (connections.size === 0) {
      gameConnections.delete(gameId);
    }
  }
};

/**
 * Broadcast an update message to all connected clients for a game
 */
export const broadcastGameUpdate = (gameId: string): void => {
  const connections = gameConnections.get(gameId);
  if (!connections) return;

  const encoder = new TextEncoder();
  const message = encoder.encode("data: update\n\n");

  for (const controller of connections) {
    try {
      controller.enqueue(message);
    } catch {
      // Controller may be closed, remove it
      connections.delete(controller);
    }
  }
};

/**
 * Create an SSE response stream for a game
 */
export const createSSEStream = (gameId: string): Response => {
  let controller: SSEController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      registerConnection(gameId, controller);

      // Send initial comment to establish connection
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(": connected\n\n"));
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
