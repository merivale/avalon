import {
  assassinateMerlin,
  validateAssassinateMerlin,
} from "../core/assassinateMerlin.ts";
import { joinGame, validateJoinGame } from "@/core/joinGame.ts";
import newGame from "@/core/newGame.ts";
import { proposeTeam, validateProposeTeam } from "@/core/proposeTeam.ts";
import { startGame, validateStartGame } from "@/core/startGame.ts";
import { validateVoteOnQuest, voteOnQuest } from "@/core/voteOnQuest.ts";
import { validateVoteOnTeam, voteOnTeam } from "@/core/voteOnTeam.ts";
import type { HandlerArgs } from "@/handlers/types.ts";
import { getGame, saveGame, savePlayer } from "@/utils/database.ts";
import { redirectResponse } from "@/utils/response.tsx";
import { broadcastGameUpdate } from "@/utils/sse.ts";

// update player's display name
export const handleUpdateName = async (
  { request, player }: HandlerArgs,
): Promise<Response> => {
  const formData = await request.formData();
  const displayName = formData.get("displayName")?.toString().trim();

  if (displayName && displayName.length > 0) {
    const updatedPlayer = { ...player, displayName };
    await savePlayer(updatedPlayer);
  }

  const referer = request.headers.get("Referer");
  const redirectTo = referer ? new URL(referer).pathname : "/";
  return redirectResponse(redirectTo, request);
};

// create a new game and add the player who created it
export const handleNewGame = async (
  { request, player }: HandlerArgs,
): Promise<Response> => {
  const game = joinGame(newGame(), player.id);
  await saveGame(game);
  return redirectResponse(`/game/${game.id}`, request);
};

// join an existing game
export const handleJoinGame = async (
  { request, player }: HandlerArgs,
): Promise<Response> => {
  const formData = await request.formData();
  const gameId = formData.get("gameId")?.toString().trim();

  const referer = request.headers.get("Referer");
  const refererPath = referer ? new URL(referer).pathname : "/";

  if (!gameId) {
    return redirectResponse(
      `${refererPath}?error=Game ID is required`,
      request,
    );
  }

  const game = await getGame(gameId);
  if (!game) {
    return redirectResponse(`${refererPath}?error=Game not found`, request);
  }

  const validationError = validateJoinGame(game, player.id);
  if (validationError) {
    return redirectResponse(
      `${refererPath}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = joinGame(game, player.id);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);
  return redirectResponse(`/game/${gameId}`, request);
};

// start the game with selected special roles
export const handleStartGame = async (
  { match, request }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const formData = await request.formData();
  const specialRoles = {
    merlin: formData.get("merlin") === "true",
    percival: formData.get("percival") === "true",
    assassin: formData.get("assassin") === "true",
    mordred: formData.get("mordred") === "true",
    morgana: formData.get("morgana") === "true",
    oberon: formData.get("oberon") === "true",
  };

  const validationError = validateStartGame(game, specialRoles);
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = startGame(game, specialRoles);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};

// propose a team for the current mission
export const handleProposeTeam = async (
  { match, request, player }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const formData = await request.formData();
  const teamMemberIds = formData.getAll("team").map((v) => v.toString());

  const validationError = validateProposeTeam(game, player.id, teamMemberIds);
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = proposeTeam(game, player.id, teamMemberIds);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};

// approve the proposed team for the current mission
export const handleApproveTeam = async (
  { match, request, player }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const validationError = validateVoteOnTeam(game, player.id);
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = voteOnTeam(game, player.id, true);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};

// reject the proposed team for the current mission
export const handleRejectTeam = async (
  { match, request, player }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const validationError = validateVoteOnTeam(game, player.id);
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = voteOnTeam(game, player.id, false);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};

// vote to succeed the current mission
export const handleSucceedMission = async (
  { match, request, player }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const validationError = validateVoteOnQuest(game, player.id);
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = voteOnQuest(game, player.id, true);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};

// vote to fail the current mission
export const handleFailMission = async (
  { match, request, player }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const validationError = validateVoteOnQuest(game, player.id);
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = voteOnQuest(game, player.id, false);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};

// assassinate Merlin to win the game for Evil
export const handleAssassinateMerlin = async (
  { match, request, player }: HandlerArgs,
): Promise<Response> => {
  const gameId = match.pathname.groups.id!;
  const game = await getGame(gameId);

  if (!game) {
    return redirectResponse("/?error=Game not found", request);
  }

  const formData = await request.formData();
  const targetPlayerId = formData.get("targetPlayerId")?.toString().trim();

  const validationError = validateAssassinateMerlin(
    game,
    player.id,
    targetPlayerId!,
  );
  if (validationError) {
    return redirectResponse(
      `/game/${gameId}?error=${encodeURIComponent(validationError)}`,
      request,
    );
  }

  const updatedGame = assassinateMerlin(game, targetPlayerId!);
  await saveGame(updatedGame);
  broadcastGameUpdate(gameId);

  return redirectResponse(`/game/${gameId}`, request);
};
