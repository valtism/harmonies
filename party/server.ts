import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import {
  Color,
  PrivateGameState,
  PublicGameState,
  TokenType,
  actionSchema,
  canPlaceToken,
  userSchema,
} from "../src/shared";

type StatefulPartyConnection = Party.Connection<{ userId: string }>;

const gridA: PublicGameState["grid"] = [
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

const allTokens = [
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

const initialState: PublicGameState = {
  grid: gridA,
  playerList: [],
  currentPlayerId: null,
  boardType: "A",
  centralBoard: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  players: {},
};

export default class Server implements Party.Server {
  privateGameState: PrivateGameState;
  publicGameState: PublicGameState;
  history: PublicGameState[];

  constructor(readonly room: Party.Room) {
    this.publicGameState = structuredClone(initialState);

    const pouch: PrivateGameState["pouch"] = shuffle([...allTokens]).map(
      (color) => ({
        id: crypto.randomUUID(),
        color,
        type: "pouch",
      }),
    );

    const tokensById = pouch.reduce<PrivateGameState["tokensById"]>(
      (acc, token) => {
        acc[token.id] = token;
        return acc;
      },
      {},
    );
    this.privateGameState = {
      tokensById,
      pouch,
    };
    this.history = [];
  }

  onConnect(conn: StatefulPartyConnection, ctx: Party.ConnectionContext) {
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

    conn.setState({ userId: user.id });

    const alreadyAdded = this.publicGameState.playerList.some(
      (player) => player.id === user.id,
    );

    if (!alreadyAdded) {
      this.publicGameState.playerList.push(user);
      this.publicGameState.players[user.id] = {
        board: {},
        takenTokens: [null, null, null],
        placing: null,
      };
    }

    this.room.broadcast(JSON.stringify(this.publicGameState));
  }

  onMessage(message: string, sender: StatefulPartyConnection) {
    try {
      const action = actionSchema.parse(JSON.parse(message));
      const userId = sender.state?.userId;
      if (!userId) throw new Error("Missing userId");
      // const isPlayerTurn = userId === this.publicGameState.currentPlayerId;

      switch (action.type) {
        case "startGame":
          this.startGame();
          break;
        case "takeTokens":
          // if (!isPlayerTurn) {
          //   throw new Error("Not your turn");
          // }
          this.takeTokens(userId, action.payload);
          break;
        case "grabToken":
          this.grabFromTaken(userId, action.payload.takenIndex);
          break;
        case "placeToken":
          this.placeToken(userId, action.payload.coords);
          break;
        default:
          action satisfies never;
      }
    } catch (error) {
      console.error("Invalid message format:", error);
    }

    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    // this.room.broadcast(
    //   `${sender.id}: ${message}`,
    //   // ...except for the connection it came from
    //   [sender.id],
    // );
  }

  startGame() {
    // if (this.publicGameState.playerList.length < 2) {
    //   throw new Error("Need at least 2 players to start");
    // }

    // Select a random player to start the game
    const randomIndex = Math.floor(
      Math.random() * this.publicGameState.playerList.length,
    );
    this.publicGameState.currentPlayerId =
      this.publicGameState.playerList[randomIndex].id;

    this.privateGameState.tokensById = shuffle([...allTokens]).reduce<
      PrivateGameState["tokensById"]
    >((tokensById, color) => {
      const token: TokenType = {
        id: `token-${crypto.randomUUID()}`,
        color,
        type: "pouch",
      };
      tokensById[token.id] = token;
      return tokensById;
    }, {});

    let i = 0;
    for (const key in this.privateGameState.tokensById) {
      if (i >= 15) continue;
      const zone = Math.floor(i / 3);
      const place = i % 3;
      const token = this.privateGameState.tokensById[key];
      token.type = "centralBoard";
      if (token.type !== "centralBoard") return; //make TS happy
      token.position = { zone, place };
      i++;
    }

    // Initialize empty player boards
    this.publicGameState.players = this.publicGameState.playerList.reduce<
      PublicGameState["players"]
    >((acc, player) => {
      acc[player.id] = {
        board: {},
        takenTokens: [null, null, null],
        placing: null,
      };
      return acc;
    }, {});

    // Broadcast game start
    this.allocateAndBroadcast();
  }

  takeTokens(userId: string, zone: number) {
    let place = 0;
    for (const key in this.privateGameState.tokensById) {
      const token = this.privateGameState.tokensById[key];
      if (token.type === "centralBoard" && token.position.zone === zone) {
        const newToken: TokenType = {
          id: token.id,
          color: token.color,
          type: "taken",
          position: { player: userId, place: place },
        };
        this.privateGameState.tokensById[key] = newToken;
        place++;
      }
    }
    this.allocateAndBroadcast();
  }

  grabFromTaken(playerId: string, index: number) {
    for (const key in this.privateGameState.tokensById) {
      const token = this.privateGameState.tokensById[key];
      if (
        token.type === "taken" &&
        token.position.player === playerId &&
        token.position.place === index
      ) {
        const newToken: TokenType = {
          id: token.id,
          color: token.color,
          type: "placing",
          position: { player: playerId },
        };
        this.privateGameState.tokensById[key] = newToken;
      }
    }
    this.allocateAndBroadcast();
  }

  placeToken(playerId: string, coords: string) {
    const placingToken = this.publicGameState.players[playerId].placing;
    if (!placingToken) throw new Error("No token found");

    const stack: TokenType[] = [];
    for (const key in this.privateGameState.tokensById) {
      const token = this.privateGameState.tokensById[key];
      if (token.type === "playerBoard") console.log(token);
      if (
        token.type === "playerBoard" &&
        token.position.player === playerId &&
        token.position.place.coords === coords
      ) {
        stack[token.position.place.stackPostion] = token;
      }
    }

    const canPlace = canPlaceToken(placingToken, stack);
    if (!canPlace) throw new Error("Cannot place token");
    const newToken: TokenType = {
      ...placingToken,
      type: "playerBoard",
      position: {
        player: playerId,
        place: {
          coords: coords,
          stackPostion: stack.length,
        },
      },
    };
    this.privateGameState.tokensById[placingToken.id] = newToken;

    this.allocateAndBroadcast();
  }

  allocateTokens() {
    const pouchTokens: PrivateGameState["pouch"] = [];
    const centralBoardTokens: PublicGameState["centralBoard"] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    const players = this.publicGameState.playerList.reduce<
      PublicGameState["players"]
    >((players, player) => {
      players[player.id] = {
        board: this.publicGameState.grid.reduce<
          PublicGameState["players"][string]["board"]
        >((board, [q, r]) => {
          const key = `(${q},${r})`;
          board[key] = {
            cube: null,
            tokens: [],
          };
          return board;
        }, {}),
        takenTokens: [null, null, null],
        placing: null,
      };
      return players;
    }, {});

    // Iterate over the tokens and distribute them
    for (const key in this.privateGameState.tokensById) {
      const token = this.privateGameState.tokensById[key];
      switch (token.type) {
        case "pouch":
          pouchTokens.push(token);
          break;
        case "centralBoard":
          centralBoardTokens[token.position.zone][token.position.place] = token;
          break;
        case "taken":
          players[token.position.player].takenTokens[token.position.place] =
            token;
          break;
        case "placing":
          players[token.position.player].placing = token;
          break;
        case "playerBoard":
          players[token.position.player].board[
            token.position.place.coords
          ].tokens[token.position.place.stackPostion] = token;
          break;
        default:
          token satisfies never;
      }
    }

    this.privateGameState.pouch = pouchTokens;
    this.publicGameState.centralBoard = centralBoardTokens;
    this.publicGameState.players = players;
  }

  allocateAndBroadcast() {
    this.allocateTokens();
    this.room.broadcast(JSON.stringify(this.publicGameState));
  }
}

Server satisfies Party.Worker;
