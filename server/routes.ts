import {
  handleApproveTeam,
  handleAssassinateMerlin,
  handleFailMission,
  handleJoinGame,
  handleNewGame,
  handleProposeTeam,
  handleRejectTeam,
  handleStartGame,
  handleSucceedMission,
  handleUpdateName,
} from "@/server/handlers/actions.ts";
import {
  handleJavaScript,
  handleStylesheet,
} from "@/server/handlers/assets.ts";
import { handleGame, handleIndex } from "@/server/handlers/pages.tsx";
import { handleGameEvents } from "@/server/handlers/sse.tsx";
import type { Route } from "@/server/types.ts";

export default [
  // assets
  {
    pattern: new URLPattern({ pathname: "/assets/styles.css" }),
    handler: handleStylesheet,
  },
  {
    pattern: new URLPattern({ pathname: "/assets/main.js" }),
    handler: handleJavaScript,
  },
  // html pages
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: handleIndex,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id" }),
    handler: handleGame,
  },
  // sse endpoints
  {
    pattern: new URLPattern({ pathname: "/game/:id/events" }),
    handler: handleGameEvents,
  },
  // actions
  {
    pattern: new URLPattern({ pathname: "/update-name" }),
    method: "POST",
    handler: handleUpdateName,
  },
  {
    pattern: new URLPattern({ pathname: "/new-game" }),
    method: "POST",
    handler: handleNewGame,
  },
  {
    pattern: new URLPattern({ pathname: "/join-game" }),
    method: "POST",
    handler: handleJoinGame,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/start" }),
    method: "POST",
    handler: handleStartGame,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/propose-team" }),
    method: "POST",
    handler: handleProposeTeam,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/approve-team" }),
    method: "POST",
    handler: handleApproveTeam,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/reject-team" }),
    method: "POST",
    handler: handleRejectTeam,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/succeed-mission" }),
    method: "POST",
    handler: handleSucceedMission,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/fail-mission" }),
    method: "POST",
    handler: handleFailMission,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id/assassinate-merlin" }),
    method: "POST",
    handler: handleAssassinateMerlin,
  },
] satisfies Route[];
