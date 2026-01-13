const content = document.getElementById("content");

const subscribeToGameEvents = (gameId) => {
  const eventSource = new EventSource(`/game/${gameId}/events`);
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
  console.log(`Subscribed to game events for game ${gameId}.`);
};

const pathname = globalThis.location.pathname;
const gameId = pathname.match(/^\/game\/([^\/]+)/)?.[1];
if (gameId) {
  subscribeToGameEvents(gameId);
}
