import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import {
  Color,
  PrivateGameState,
  PublicGameState,
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
  ...Array.from({ length: 23 }).map(() => Color.Blue),
  ...Array.from({ length: 23 }).map(() => Color.Gray),
  ...Array.from({ length: 21 }).map(() => Color.Brown),
  ...Array.from({ length: 19 }).map(() => Color.Green),
  ...Array.from({ length: 19 }).map(() => Color.Yellow),
  ...Array.from({ length: 15 }).map(() => Color.Red),
];

function shuffle<T>(array: T[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const mockToken = {
  id: "73dcdb31-f028-418c-9b70-f9181265e223",
  color: Color.Blue,
};

const initialState: PublicGameState = {
  grid: gridA,
  players: [],
  currentPlayerId: null,
  board: "A",
  centralBoard: [null, null, null, null, null],
  playerBoards: {},
};

export default class Server implements Party.Server {
  privateGameState: PrivateGameState;
  publicGameState: PublicGameState;
  history: PublicGameState[];

  constructor(readonly room: Party.Room) {
    this.publicGameState = structuredClone(initialState);
    this.privateGameState = {
      bag: shuffle([...allTiles]).map((color) => ({
        id: crypto.randomUUID(),
        color,
      })),
    };
    this.history = [];
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
    id: ${conn.id}
    room: ${this.room.id}
    url: ${new URL(ctx.request.url).pathname}`
    );

    const userJson = JSON.parse(
      new URL(ctx.request.url).searchParams.get("user") || ""
    );
    const user = userSchema.parse(userJson);

    const alreadyAdded = this.publicGameState.players.some(
      (player) => player.id === user.id
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
      [sender.id]
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
      Math.random() * this.publicGameState.players.length
    );
    this.publicGameState.currentPlayerId =
      this.publicGameState.players[randomIndex].id;

    // Initialize empty player boards
    this.publicGameState.playerBoards = this.publicGameState.players.reduce(
      (acc, player) => {
        acc[player.id] = {};
        return acc;
      },
      {}
    );

    for (let i = 0; i < 5; i++) {
      this.publicGameState.centralBoard[i] = [
        this.privateGameState.bag.pop()!,
        this.privateGameState.bag.pop()!,
        this.privateGameState.bag.pop()!,
      ];
    }

    // Broadcast game start
    this.room.broadcast(JSON.stringify(this.publicGameState));
  }
}

Server satisfies Party.Worker;
