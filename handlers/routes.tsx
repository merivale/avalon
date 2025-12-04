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
} from "@/handlers/actions.ts";
import type { Route } from "@/handlers/types.ts";
import {
  handleGameEvents,
  handleGameView,
  handleIndex,
  handleStylesheet,
} from "@/handlers/views.tsx";

export default [
  // static files
  {
    pattern: new URLPattern({ pathname: "/assets/styles.css" }),
    handler: handleStylesheet,
  },
  // game views
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: handleIndex,
  },
  {
    pattern: new URLPattern({ pathname: "/game/:id" }),
    handler: handleGameView,
  },
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
