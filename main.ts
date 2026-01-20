import server from "@/server/server.ts";

server.start(8080);
server.setupFixtures();
server.setupSSEHeartbeat(10000);
