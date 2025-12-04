import type { Game, Player } from "@/core/types.ts";

type GameData = Omit<Game, "players"> & { playerIds: string[] };

const kv = await Deno.openKv();

export const saveGame = async (game: Game): Promise<void> => {
  const gameToSave: GameData = { ...game, playerIds: game.players.map((p) => p.id) };
  await kv.set(["games", game.id], gameToSave);
};

export const getGame = async (id: string): Promise<Game | null> => {
  const result = await kv.get<GameData>(["games", id]);
  if (!result.value) {
    return null;
  }
  const gameData = result.value;
  const players = await Promise.all(
    gameData.playerIds.map(async (playerId) => {
      const playerResult = await kv.get<Player>(["players", playerId]);
      return playerResult.value!;
    }),
  );
  return { ...gameData, players };
};

export const savePlayer = async (player: Player): Promise<void> => {
  await kv.set(["players", player.id], player);
};

export const getPlayer = async (playerId: string): Promise<Player | null> => {
  const result = await kv.get<Player>(["players", playerId]);
  return result.value;
};

export const getOrCreatePlayer = async (playerId: string): Promise<Player> => {
  const existing = await getPlayer(playerId);
  if (existing) {
    return existing;
  }
  const newPlayer: Player = { id: playerId, displayName: "anonymous" };
  await savePlayer(newPlayer);
  return newPlayer;
};
