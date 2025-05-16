import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import {
  Color,
  History,
  PrivateGameState,
  DerivedPublicGameState,
  TokenType,
  actionSchema,
  canPlaceToken,
  userSchema,
  PlayersById,
  Broadcast,
} from "../src/shared";

type StatefulPartyConnection = Party.Connection<{ playerId: string }>;

const gridA: DerivedPublicGameState["grid"] = [
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

const grids = { A: gridA };

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

// TODO: only generate this on allocate, not constructor
// const initialState: DerivedPublicGameState = {
//   grid: gridA,
//   centralBoard: [
//     [null, null, null],
//     [null, null, null],
//     [null, null, null],
//     [null, null, null],
//     [null, null, null],
//   ],
//   players: {},
// };

export default class Server implements Party.Server {
  playersById: PlayersById;
  gameState: PrivateGameState;
  derivedGameState: DerivedPublicGameState;
  history: History[];

  constructor(readonly room: Party.Room) {
    this.playersById = {};
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

    const playerJson = JSON.parse(
      new URL(ctx.request.url).searchParams.get("player") || "",
    );
    const player = userSchema.parse(playerJson);

    conn.setState({ playerId: player.id });

    this.playersById[player.id] = player;

    this.broadcast({
      type: "players",
      players: this.playersById,
    });
  }

  onMessage(message: string, sender: StatefulPartyConnection) {
    try {
      const action = actionSchema.parse(JSON.parse(message));
      const playerId = sender.state?.playerId;
      if (!playerId) throw new Error("Missing playerId");
      // const isPlayerTurn = userId === this.publicGameState.currentPlayerId;

      switch (action.type) {
        case "startGame":
          this.startGame(playerId);
          break;
        case "takeTokens":
          // if (!isPlayerTurn) {
          //   throw new Error("Not your turn");
          // }
          this.takeTokens(playerId, action.payload);
          break;
        case "placeToken":
          this.placeToken(
            playerId,
            action.payload.tokenId,
            action.payload.coords,
          );
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

  broadcast(broadcast: Broadcast) {
    this.room.broadcast(JSON.stringify(broadcast));
  }

  // performAction(action: ActionType) {
  //   try {
  //     this.applyActionToCurrentState(action);
  //   } catch (error) {}
  // }

  // applyActionToCurrentState(action: ActionType) {}

  startGame(playerId: string) {
    // if (this.publicGameState.playerList.length < 2) {
    //   throw new Error("Need at least 2 players to start");
    // }

    // Select a random player to start the game

    const playerIdList = shuffle(Object.keys(this.playersById));

    // this.privateGameState.currentPlayerId =
    //   this.privateGameState.playerList[randomIndex].id;

    const tokensById = shuffle([...allTokens]).reduce<
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
    for (const key in tokensById) {
      if (i >= 15) continue;
      const zone = Math.floor(i / 3);
      const place = i % 3;
      const token = tokensById[key];
      token.type = "centralBoard";
      if (token.type !== "centralBoard") return; //make TS happy
      token.position = { zone, place };
      i++;
    }

    this.gameState = {
      boardType: "A",
      playerIdList: playerIdList,
      currentPlayerId: playerIdList[0],
      tokensById: tokensById,
    };

    // Initialize empty player boards
    // this.publicGameState.players = this.privateGameState.playerList.reduce<
    //   DerivedPublicGameState["players"]
    // >((acc, player) => {
    //   acc[player.id] = {
    //     board: {},
    //     takenTokens: [null, null, null],
    //   };
    //   return acc;
    // }, {});

    // Broadcast game start
    this.allocateAndBroadcast(playerId);
  }

  takeTokens(playerId: string, zone: number) {
    let place = 0;
    for (const key in this.gameState.tokensById) {
      const token = this.gameState.tokensById[key];
      if (token.type === "centralBoard" && token.position.zone === zone) {
        const newToken: TokenType = {
          id: token.id,
          color: token.color,
          type: "taken",
          position: { player: playerId, place: place },
        };
        this.gameState.tokensById[key] = newToken;
        place++;
      }
    }
    this.allocateAndBroadcast(playerId);
  }

  placeToken(playerId: string, tokenId: string, coords: string) {
    const placingToken = this.gameState.tokensById[tokenId];
    if (!placingToken) throw new Error("No token found");
    if (
      placingToken.type !== "taken" ||
      placingToken.position.player !== playerId
    ) {
      throw new Error("Invalid token");
    }

    const stack: TokenType[] = [];
    for (const key in this.gameState.tokensById) {
      const token = this.gameState.tokensById[key];
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
    this.gameState.tokensById[placingToken.id] = newToken;

    this.allocateAndBroadcast(playerId);
  }

  deriveGameState(playerId: string) {
    const grid = grids[this.gameState.boardType];

    const centralBoard: DerivedPublicGameState["centralBoard"] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    const players = this.gameState.playerIdList.reduce<
      DerivedPublicGameState["players"]
    >((players, playerId) => {
      players[playerId] = {
        board: grid.reduce<DerivedPublicGameState["players"][string]["board"]>(
          (board, [q, r]) => {
            const key = `(${q},${r})`;
            board[key] = {
              cube: null,
              tokens: [],
            };
            return board;
          },
          {},
        ),
        takenTokens: [null, null, null],
      };
      return players;
    }, {});

    // Iterate over the tokens and distribute them
    for (const key in this.gameState.tokensById) {
      const token = this.gameState.tokensById[key];
      switch (token.type) {
        case "pouch":
          break;
        case "centralBoard":
          centralBoard[token.position.zone][token.position.place] = token;
          break;
        case "taken":
          players[token.position.player].takenTokens[token.position.place] =
            token;
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

    this.derivedGameState = {
      grid: grid,
      centralBoard: centralBoard,
      players: players,
      player: players[playerId],
    };
    // this.derivedGameState.centralBoard = centralBoardTokens;
    // this.derivedGameState.players = players;
  }

  allocateAndBroadcast(playerId: string) {
    this.deriveGameState(playerId);
    this.broadcast({ type: "gameState", gameState: this.derivedGameState });
  }
}

Server satisfies Party.Worker;
