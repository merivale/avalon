import handler from "@/server/handler.ts";
import { sendHeartbeat } from "@/server/handlers/sse.tsx";
import fixtures from "@/server/persistence/fixtures.ts";

export default {
  start(port = 0) {
    const onListen = () => {
      console.log(`Server running on http://localhost:${port}`);
    };
    Deno.serve({ port, onListen }, handler);
  },
  setupFixtures() {
    fixtures();
  },
  setupSSEHeartbeat(interval = 30000) {
    setInterval(sendHeartbeat, interval);
  },
};
