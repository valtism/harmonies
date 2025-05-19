import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import {
  ActionType,
  Broadcast,
  CanPerformAction,
  DerivedPublicGameState,
  History,
  ImmutablePrivateGameState,
  PlayersById,
  PrivateGameState,
  TokenType,
  actionSchema,
  tokenPlacable,
  userSchema,
} from "../src/sharedTypes";
import { allTokens, grids } from "./constants";

type StatefulPartyConnection = Party.Connection<
  Party.ConnectionState<{ playerId: string }>
>;

export default class Server implements Party.Server {
  playersById: PlayersById;
  gameState: ImmutablePrivateGameState;
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
    const action = actionSchema.parse(JSON.parse(message));
    const playerId = sender.state?.playerId;
    if (!playerId) throw new Error("Missing playerId");
    // const isPlayerTurn = userId === this.publicGameState.currentPlayerId;

    this.performAction(playerId, action);

    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    // this.room.broadcast(
    //   `${sender.id}: ${message}`,
    //   // ...except for the connection it came from
    //   [sender.id],
    // );
  }

  performAction(playerId: string, action: ActionType) {
    const canDo = this.canPerformAction(playerId, action);
    if (!canDo.ok) {
      return this.broadcast({
        type: "error",
        playerId: playerId,
        message: canDo.message,
      });
    }
    try {
      const newGameState = this.newStateFromAction(playerId, action);
      this.history.push({
        action: action,
        gameState: newGameState,
      });
      this.gameState = newGameState;
      this.allocateAndBroadcast(playerId);
    } catch (error) {
      // TODO: Broadcast the error
      console.error(error);
    }
  }

  canPerformAction(playerId: string, action: ActionType): CanPerformAction {
    if (
      this.gameState?.currentPlayerId &&
      this.gameState?.currentPlayerId !== playerId
    ) {
      return { ok: false, message: "Not your turn" };
    }

    switch (action.type) {
      case "startGame":
        return this.canStartGame();
      case "takeTokens":
        return this.canTakeTokens();
      case "placeToken":
        return this.canPlaceToken(playerId);
      default:
        action satisfies never;
    }
    throw new Error("should never happen");
  }

  newStateFromAction(
    playerId: string,
    action: ActionType,
  ): ImmutablePrivateGameState {
    switch (action.type) {
      case "startGame":
        return this.startGame();
      case "takeTokens":
        // if (!isPlayerTurn) {
        //   throw new Error("Not your turn");
        // }
        return this.takeTokens(playerId, action.payload);
      case "placeToken":
        return this.placeToken(
          playerId,
          action.payload.tokenId,
          action.payload.coords,
        );
      default:
        action satisfies never;
    }
    throw new Error("Should never happen");
  }

  canStartGame(): CanPerformAction {
    return { ok: true };
  }

  startGame(): ImmutablePrivateGameState {
    const playerIdList = shuffle(Object.keys(this.playersById));

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
      const token = tokensById[key]!;
      token.type = "centralBoard";
      if (token.type !== "centralBoard") {
        // Make type checker happy
        throw new Error("Should never happen");
      }
      token.position = { zone, place };
      i++;
    }

    const currentPlayerId = playerIdList[0];
    if (!currentPlayerId) throw new Error("No players found");

    return {
      boardType: "A",
      playerIdList: playerIdList,
      currentPlayerId: currentPlayerId,
      tokensById: tokensById,
    };
  }

  canTakeTokens(): CanPerformAction {
    if (this.history.at(-1)?.action.type === "takeTokens") {
      // TODO: Do this better
      return { ok: false, message: "Already taken tokens" };
    }
    return { ok: true };
  }

  takeTokens(playerId: string, zone: number): ImmutablePrivateGameState {
    const tokensById: PrivateGameState["tokensById"] = {};
    let place = 0;
    for (const id in this.gameState.tokensById) {
      const token = this.gameState.tokensById[id];
      if (token.type === "centralBoard" && token.position.zone === zone) {
        const newToken: TokenType = {
          id: token.id,
          color: token.color,
          type: "taken",
          position: { player: playerId, place: place },
        };
        tokensById[id] = newToken;
        place++;
      } else {
        tokensById[id] = token;
      }
    }
    return {
      ...this.gameState,
      tokensById,
    };
  }

  canPlaceToken(playerId: string): CanPerformAction {
    return { ok: true };
  }

  placeToken(
    playerId: string,
    tokenId: string,
    coords: string,
  ): ImmutablePrivateGameState {
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

    const canPlace = tokenPlacable(placingToken, stack);
    if (!canPlace) throw new Error("Cannot place token");

    const tokensById: PrivateGameState["tokensById"] = {};
    for (const id in this.gameState.tokensById) {
      if (id !== tokenId) {
        const token = this.gameState.tokensById[id];
        tokensById[id] = token;
      } else {
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
        tokensById[id] = newToken;
      }
    }

    return {
      ...this.gameState,
      tokensById,
    };
  }

  allocateAndBroadcast(playerId: string) {
    this.deriveGameState(playerId);
    this.broadcast({ type: "gameState", gameState: this.derivedGameState });
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
  }

  broadcast(broadcast: Broadcast) {
    this.room.broadcast(JSON.stringify(broadcast));
  }
}

Server satisfies Party.Worker;

function shuffle<T>(array: T[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
