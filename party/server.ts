import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import {
  PrivateGameState,
  PublicGameState,
  Token,
  TupleCoordinates,
  actionSchema,
  userSchema,
} from "../src/shared";

const gridA: TupleCoordinates = [
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

const initialState: PublicGameState = {
  grid: gridA,
  players: [],
  currentPlayerId: null,
  board: "A",
  centralBoard: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  },
  playerBoards: {},
};

export default class Server implements Party.Server {
  privateGameState: PrivateGameState;
  publicGameState: PublicGameState;
  history: PublicGameState[];

  constructor(readonly room: Party.Room) {
    this.publicGameState = structuredClone(initialState);
    this.privateGameState = {
      bag: shuffle([...allTiles]),
    };
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
    const user = userSchema.parse(userJson);

    const alreadyAdded = this.publicGameState.players.some(
      (player) => player.id === user.id,
    );

    if (!alreadyAdded) {
      this.publicGameState.players.push(user);
      this.publicGameState.playerBoards[user.id] = {};
    }

    this.room.broadcast(JSON.stringify(this.publicGameState));
  }

  onMessage(message: string, sender: Party.Connection) {
    try {
      const action = actionSchema.parse(JSON.parse(message));

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
    if (this.publicGameState.players.length < 2) {
      throw new Error("Need at least 2 players to start");
    }

    // Select a random player to start the game
    const randomIndex = Math.floor(
      Math.random() * this.publicGameState.players.length,
    );
    this.publicGameState.currentPlayerId =
      this.publicGameState.players[randomIndex].id;

    // Initialize empty player boards
    this.publicGameState.playerBoards = this.publicGameState.players.reduce(
      (acc, player) => {
        acc[player.id] = {};
        return acc;
      },
      {},
    );

    this.publicGameState.centralBoard = {
      0: this.privateGameState.bag.splice(0, 3),
      1: this.privateGameState.bag.splice(0, 3),
      2: this.privateGameState.bag.splice(0, 3),
      3: this.privateGameState.bag.splice(0, 3),
      4: this.privateGameState.bag.splice(0, 3),
    };

    // Broadcast game start
    this.room.broadcast(JSON.stringify(this.publicGameState));
  }
}

Server satisfies Party.Worker;
