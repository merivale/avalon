import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import type { Player, Role } from "@/core/types.ts";
import {
  getEvilCount,
  getRequiredFails,
  getRequiredTeamSize,
  getVisibleRoleForPlayer,
  isEvil,
  isGood,
  teamList,
} from "@/core/gameConfig.ts";

describe("getEvilCount", () => {
  it("returns 2 for 5-6 players", () => {
    assertEquals(getEvilCount(5), 2);
    assertEquals(getEvilCount(6), 2);
  });

  it("returns 3 for 7-9 players", () => {
    assertEquals(getEvilCount(7), 3);
    assertEquals(getEvilCount(8), 3);
    assertEquals(getEvilCount(9), 3);
  });

  it("returns 4 for 10 players", () => {
    assertEquals(getEvilCount(10), 4);
  });
});

describe("getRequiredTeamSize", () => {
  it("returns correct sizes for 5 players", () => {
    assertEquals(getRequiredTeamSize(5, 1), 2);
    assertEquals(getRequiredTeamSize(5, 2), 3);
    assertEquals(getRequiredTeamSize(5, 3), 2);
    assertEquals(getRequiredTeamSize(5, 4), 3);
    assertEquals(getRequiredTeamSize(5, 5), 3);
  });

  it("returns correct sizes for 6 players", () => {
    assertEquals(getRequiredTeamSize(6, 1), 2);
    assertEquals(getRequiredTeamSize(6, 2), 3);
    assertEquals(getRequiredTeamSize(6, 3), 4);
    assertEquals(getRequiredTeamSize(6, 4), 3);
    assertEquals(getRequiredTeamSize(6, 5), 4);
  });

  it("returns correct sizes for 7 players", () => {
    assertEquals(getRequiredTeamSize(7, 1), 2);
    assertEquals(getRequiredTeamSize(7, 2), 3);
    assertEquals(getRequiredTeamSize(7, 3), 3);
    assertEquals(getRequiredTeamSize(7, 4), 4);
    assertEquals(getRequiredTeamSize(7, 5), 4);
  });

  it("returns correct sizes for 8 players", () => {
    assertEquals(getRequiredTeamSize(8, 1), 3);
    assertEquals(getRequiredTeamSize(8, 2), 4);
    assertEquals(getRequiredTeamSize(8, 3), 4);
    assertEquals(getRequiredTeamSize(8, 4), 5);
    assertEquals(getRequiredTeamSize(8, 5), 5);
  });

  it("returns correct sizes for 9 players", () => {
    assertEquals(getRequiredTeamSize(9, 1), 3);
    assertEquals(getRequiredTeamSize(9, 2), 4);
    assertEquals(getRequiredTeamSize(9, 3), 4);
    assertEquals(getRequiredTeamSize(9, 4), 5);
    assertEquals(getRequiredTeamSize(9, 5), 5);
  });

  it("returns correct sizes for 10 players", () => {
    assertEquals(getRequiredTeamSize(10, 1), 3);
    assertEquals(getRequiredTeamSize(10, 2), 4);
    assertEquals(getRequiredTeamSize(10, 3), 4);
    assertEquals(getRequiredTeamSize(10, 4), 5);
    assertEquals(getRequiredTeamSize(10, 5), 5);
  });
});

describe("getRequiredFails", () => {
  it("returns 1 for quest 1 with any player count", () => {
    assertEquals(getRequiredFails(5, 1), 1);
    assertEquals(getRequiredFails(7, 1), 1);
    assertEquals(getRequiredFails(10, 1), 1);
  });

  it("returns 1 for quest 2 with any player count", () => {
    assertEquals(getRequiredFails(5, 2), 1);
    assertEquals(getRequiredFails(7, 2), 1);
    assertEquals(getRequiredFails(10, 2), 1);
  });

  it("returns 1 for quest 3 with any player count", () => {
    assertEquals(getRequiredFails(5, 3), 1);
    assertEquals(getRequiredFails(7, 3), 1);
    assertEquals(getRequiredFails(10, 3), 1);
  });

  it("returns 1 for quest 4 with 5-6 players", () => {
    assertEquals(getRequiredFails(5, 4), 1);
    assertEquals(getRequiredFails(6, 4), 1);
  });

  it("returns 2 for quest 4 with 7+ players", () => {
    assertEquals(getRequiredFails(7, 4), 2);
    assertEquals(getRequiredFails(8, 4), 2);
    assertEquals(getRequiredFails(9, 4), 2);
    assertEquals(getRequiredFails(10, 4), 2);
  });

  it("returns 1 for quest 5 with any player count", () => {
    assertEquals(getRequiredFails(5, 5), 1);
    assertEquals(getRequiredFails(7, 5), 1);
    assertEquals(getRequiredFails(10, 5), 1);
  });
});

describe("isGood", () => {
  it("returns true for good roles", () => {
    assertEquals(isGood("merlin"), true);
    assertEquals(isGood("percival"), true);
    assertEquals(isGood("servant"), true);
  });

  it("returns false for evil roles", () => {
    assertEquals(isGood("minion"), false);
    assertEquals(isGood("mordred"), false);
    assertEquals(isGood("morgana"), false);
    assertEquals(isGood("oberon"), false);
  });
});

describe("isEvil", () => {
  it("returns false for good roles", () => {
    assertEquals(isEvil("merlin"), false);
    assertEquals(isEvil("percival"), false);
    assertEquals(isEvil("servant"), false);
  });

  it("returns true for evil roles", () => {
    assertEquals(isEvil("minion"), true);
    assertEquals(isEvil("mordred"), true);
    assertEquals(isEvil("morgana"), true);
    assertEquals(isEvil("oberon"), true);
  });
});

describe("getVisibleRoleForPlayer", () => {
  describe("when viewer is Merlin", () => {
    const viewer: Role = "merlin";

    it("sees morgana as minion", () => {
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "minion");
    });

    it("sees oberon as minion", () => {
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "minion");
    });

    it("sees minion as minion", () => {
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "minion");
    });

    it("sees mordred as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("mordred", viewer), "unknown");
    });

    it("sees good roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
    });
  });

  describe("when viewer is Percival", () => {
    const viewer: Role = "percival";

    it("sees merlin as merlin", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "merlin");
    });

    it("sees morgana as merlin", () => {
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "merlin");
    });

    it("sees other roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("mordred", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
    });
  });

  describe("when viewer is Mordred", () => {
    const viewer: Role = "mordred";

    it("sees evil players as minion", () => {
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "minion");
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "minion");
    });

    it("sees Oberon as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "unknown");
    });

    it("sees good roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
    });
  });

  describe("when viewer is Morgana", () => {
    const viewer: Role = "morgana";

    it("sees evil players as minion", () => {
      assertEquals(getVisibleRoleForPlayer("mordred", viewer), "minion");
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "minion");
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "minion");
    });

    it("sees Oberon as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "unknown");
    });

    it("sees good roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
    });
  });

  describe("when viewer is Oberon", () => {
    const viewer: Role = "oberon";

    it("sees all roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("mordred", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "unknown");
    });
  });

  describe("when viewer is minion", () => {
    const viewer: Role = "minion";

    it("sees evil players as minion", () => {
      assertEquals(getVisibleRoleForPlayer("mordred", viewer), "minion");
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "minion");
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "minion");
    });

    it("sees Oberon as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "unknown");
    });

    it("sees good roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
    });
  });

  describe("when viewer is servant", () => {
    const viewer: Role = "servant";

    it("sees all roles as unknown", () => {
      assertEquals(getVisibleRoleForPlayer("merlin", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("percival", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("servant", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("mordred", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("morgana", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("oberon", viewer), "unknown");
      assertEquals(getVisibleRoleForPlayer("minion", viewer), "unknown");
    });
  });
});

describe("teamList", () => {
  it("returns empty string for empty array", () => {
    assertEquals(teamList([]), "");
  });

  it("returns single name for one player", () => {
    const players: Player[] = [{ id: "1", displayName: "Alice" }];
    assertEquals(teamList(players), "Alice");
  });

  it("returns 'X and Y' for two players", () => {
    const players: Player[] = [
      { id: "1", displayName: "Alice" },
      { id: "2", displayName: "Bob" },
    ];
    assertEquals(teamList(players), "Alice and Bob");
  });

  it("returns 'X, Y, and Z' for three players", () => {
    const players: Player[] = [
      { id: "1", displayName: "Alice" },
      { id: "2", displayName: "Bob" },
      { id: "3", displayName: "Charlie" },
    ];
    assertEquals(teamList(players), "Alice, Bob, and Charlie");
  });

  it("returns 'W, X, Y, and Z' for four players", () => {
    const players: Player[] = [
      { id: "1", displayName: "Alice" },
      { id: "2", displayName: "Bob" },
      { id: "3", displayName: "Charlie" },
      { id: "4", displayName: "David" },
    ];
    assertEquals(teamList(players), "Alice, Bob, Charlie, and David");
  });
});
