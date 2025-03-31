import "@total-typescript/ts-reset";
import { type } from "arktype";
import { TupleCoordinates } from "honeycomb-grid";
import type * as Party from "partykit/server";

const gridA: TupleCoordinates[] = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [2, -1],
  [2, 0],
  [2, 1],
  [2, 2],
  [2, 3],
  [3, -1],
  [3, 0],
  [3, 1],
  [3, 2],
  [4, -2],
  [4, -1],
  [4, 0],
  [4, 1],
  [4, 2],
];

const Token = {
  Blue: "blue",
  Gray: "gray",
  Brown: "brown",
  Green: "green",
  Yellow: "yellow",
  Red: "red",
} as const;
type Token = (typeof Token)[keyof typeof Token];
const Cubes = {
  Animal: "animal",
  Spirit: "spirit",
} as const;
type Cube = (typeof Cubes)[keyof typeof Cubes];

interface Tile {
  tokens: Token[];
  cube: Cube | null;
}

const allTiles = [
  ...Array.from({ length: 23 }).map(() => Token.Blue),
  ...Array.from({ length: 23 }).map(() => Token.Gray),
  ...Array.from({ length: 21 }).map(() => Token.Brown),
  ...Array.from({ length: 19 }).map(() => Token.Green),
  ...Array.from({ length: 19 }).map(() => Token.Yellow),
  ...Array.from({ length: 15 }).map(() => Token.Red),
];

function shuffle<T>(array: T[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

type CentralBoard = {
  0: Token[];
  1: Token[];
  2: Token[];
  3: Token[];
  4: Token[];
};

const userDef = type({
  id: "string",
  name: "string",
});

type User = typeof userDef.infer;

interface GameState {
  grid: TupleCoordinates[];
  players: User[];
  currentPlayerId: string | null;
  board: "A" | "B";
  bag: Token[];
  centralBoard: CentralBoard;
  playerBoards: Record<string, Record<string, Tile>>;
}

const initialState: GameState = {
  grid: gridA,
  players: [],
  currentPlayerId: null,
  board: "A",
  bag: [],
  centralBoard: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  },
  playerBoards: {},
};

type ActionType =
  | { type: "addPlayer"; payload: string }
  | { type: "startGame"; payload: string };

export default class Server implements Party.Server {
  gameState: GameState;
  history: GameState[];

  constructor(readonly room: Party.Room) {
    this.gameState = structuredClone(initialState);
    this.history = [];
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
    id: ${conn.id}
    room: ${this.room.id}
    url: ${new URL(ctx.request.url).pathname}`,
    );

    const userJson = JSON.parse(
      new URL(ctx.request.url).searchParams.get("user") || "",
    );
    const user = userDef(userJson);

    if (user instanceof type.errors) {
      console.error(user.summary);
      return;
    }

    if (!user) {
      console.error("User not found");
      return;
    }

    const alreadyAdded = this.gameState.players.some(
      (player) => player.id === user.id,
    );

    if (!alreadyAdded) {
      this.gameState.players.push(user);
      this.gameState.playerBoards[user.id] = {};
    }

    this.room.broadcast(JSON.stringify(this.gameState));
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const action = JSON.parse(message) as ActionType;

      switch (action.type) {
        // case "addPlayer":
        //   this.addPlayer(action.payload);
        //   break;
        case "startGame":
          this.startGame();
          break;
      }
    } catch (error) {
      console.error("Invalid message format:", error);
    }

    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id],
    );
  }

  // addPlayer(playerId: string) {
  //   if (this.gameState.players.length >= 4) {
  //     throw new Error("Maximum number of players reached");
  //   }

  //   this.gameState.players.push(playerId);

  //   this.room.broadcast(
  //     `${playerId} joined the game`,
  //     // ...except for the connection it came from
  //     [playerId],
  //   );
  // }

  startGame() {
    if (this.gameState.players.length < 2) {
      throw new Error("Need at least 2 players to start");
    }

    this.gameState.bag = shuffle([...allTiles]);
    this.gameState.currentPlayerId = this.gameState.players[0].id;

    // Initialize empty player boards
    this.gameState.playerBoards = this.gameState.players.reduce(
      (acc, player) => {
        acc[player.id] = [];
        return acc;
      },
      {},
    );

    // Broadcast game start
    this.room.broadcast(
      JSON.stringify({
        type: "gameStarted",
        gameState: this.gameState,
      }),
    );
  }
}

Server satisfies Party.Worker;
