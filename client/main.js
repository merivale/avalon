const content = document.getElementById("content");

const subscribeToGameEvents = (gameId) => {
  const eventSource = new EventSource(`/game/${gameId}/events`);

  eventSource.addEventListener("open", () => {
    console.log(`SSE connection established for game ${gameId}`);
  });

  eventSource.addEventListener("error", (error) => {
    console.error(`SSE connection error for game ${gameId}:`, error);
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log("SSE connection closed. EventSource will attempt to reconnect...");
    }
  });

  eventSource.addEventListener("message", (event) => {
    if (event.data) {
      console.log("Game update received...");
      if (content.innerHTML === event.data) {
        console.log("No changes detected, skipping update.");
      } else {
        content.innerHTML = event.data;
        console.log("Content updated.");
      }
    }
  });

  eventSource.addEventListener("heartbeat", () => {
    console.log("SSE heartbeat received");
  });
};

const pathname = globalThis.location.pathname;
const gameId = pathname.match(/^\/game\/([^\/]+)/)?.[1];
if (gameId) {
  subscribeToGameEvents(gameId);
}
