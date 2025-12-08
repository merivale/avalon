import { joinGame } from "@/core/joinGame.ts";
import newGame from "@/core/newGame.ts";
import { proposeTeam } from "@/core/proposeTeam.ts";
import { startGame } from "@/core/startGame.ts";
import type { GameOptions } from "@/core/types.ts";
import { voteOnQuest } from "@/core/voteOnQuest.ts";
import { voteOnTeam } from "@/core/voteOnTeam.ts";
import { saveGame, savePlayer } from "@/utils/database.ts";

const player1 = { id: "player-1", displayName: "Alice" };
const player2 = { id: "player-2", displayName: "Bob" };
const player3 = { id: "player-3", displayName: "Charlie" };
const player4 = { id: "player-4", displayName: "Diana" };
const player5 = { id: "player-5", displayName: "Eve" };
const player6 = { id: "player-6", displayName: "Frank" };
const player7 = { id: "player-7", displayName: "Grace" };
const player8 = { id: "player-8", displayName: "Heidi" };
const player9 = { id: "player-9", displayName: "Ivan" };
const player10 = { id: "player-10", displayName: "Judy" };

// create useful game fixtures for testing and development
export default async (): Promise<void> => {
  // save players
  await savePlayer(player1);
  await savePlayer(player2);
  await savePlayer(player3);
  await savePlayer(player4);
  await savePlayer(player5);
  await savePlayer(player6);
  await savePlayer(player7);
  await savePlayer(player8);
  await savePlayer(player9);
  await savePlayer(player10);

  // save games
  await saveGame(createPreparing());
  await saveGame(createFirstQuestTeamBuilding());
  await saveGame(createFirstQuestVoting());
  await saveGame(createFirstQuestQuesting());
  await saveGame(createSecondQuestTeamBuilding());
  await saveGame(createSecondQuestVoting());
  await saveGame(createSecondQuestQuesting());
};

// create game in preparing stage with 4 players
const createPreparing = () => {
  let game = newGame("game-preparing");
  game = joinGame(game, player1);
  game = joinGame(game, player2);
  game = joinGame(game, player3);
  game = joinGame(game, player4);
  return game;
};

// create game in first quest team proposal stage with 5 players
const createFirstQuestTeamBuilding = (options: Partial<GameOptions> = {}) => {
  let game = { ...createPreparing(), id: "game-quest1-team-building" };
  game = joinGame(game, player5);
  game = startGame(game, options);
  return game;
};

// create game in first quest voting stage with 5 players
const createFirstQuestVoting = (options: Partial<GameOptions> = {}) => {
  let game = {
    ...createFirstQuestTeamBuilding(options),
    id: "game-quest1-voting",
  };
  game = proposeTeam(game, player1.id, [player1.id, player2.id]);
  return game;
};

// create game in first quest questing stage with 5 players
const createFirstQuestQuesting = (options: Partial<GameOptions> = {}) => {
  let game = { ...createFirstQuestVoting(options), id: "game-quest1-questing" };
  game = voteOnTeam(game, player1.id, true);
  game = voteOnTeam(game, player2.id, true);
  game = voteOnTeam(game, player3.id, true);
  game = voteOnTeam(game, player4.id, false);
  game = voteOnTeam(game, player5.id, false);
  return game;
};

// create game in second quest team proposal stage with 5 players
const createSecondQuestTeamBuilding = (options: Partial<GameOptions> = {}) => {
  let game = {
    ...createFirstQuestQuesting(options),
    id: "game-quest2-team-building",
  };
  game = voteOnQuest(game, player1.id, true);
  game = voteOnQuest(game, player2.id, true);
  return game;
};

// create game in second quest voting stage with 5 players
const createSecondQuestVoting = (options: Partial<GameOptions> = {}) => {
  let game = {
    ...createSecondQuestTeamBuilding(options),
    id: "game-quest2-voting",
  };
  game = proposeTeam(game, player2.id, [player1.id, player2.id]);
  return game;
};

// create game in second quest questing stage with 5 players
const createSecondQuestQuesting = (options: Partial<GameOptions> = {}) => {
  let game = {
    ...createSecondQuestVoting(options),
    id: "game-quest2-questing",
  };
  game = voteOnTeam(game, player1.id, true);
  game = voteOnTeam(game, player2.id, true);
  game = voteOnTeam(game, player3.id, true);
  game = voteOnTeam(game, player4.id, false);
  game = voteOnTeam(game, player5.id, false);
  return game;
};
