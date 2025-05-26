import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import { animalCards } from "../src/constants/animalCards";
import { grids } from "../src/constants/grids";
import { allTokens } from "../src/constants/tokens";
import {
  ActionType,
  AnimalCardType,
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

    if (this.isGameStarted()) {
      this.broadcast({ type: "gameState", gameState: this.derivedGameState! });
    } else {
      this.broadcast({
        type: "players",
        players: this.playersById,
      });
    }
  }

  onMessage(message: string, sender: StatefulPartyConnection) {
    const action = actionSchema.parse(JSON.parse(message));
    const playerId = sender.state?.playerId;
    if (!playerId) throw new Error("Missing playerId");

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

    if (action.type === "startGame") {
      // Special case for startGame
      this.startGame();
      this.allocateAndBroadcast();
      return;
    }

    if (action.type === "undo") {
      // Special case for undo
      const { gameState } = this.history.pop()!;
      this.gameState = gameState!;
      this.allocateAndBroadcast();
      return;
    }

    try {
      const oldGameState = this.gameState;
      const newGameState = this.newStateFromAction(playerId, action);
      const canUndo = this.canUndoAction(action);
      this.history.push({
        action: { ...action, canUndo: canUndo },
        gameState: oldGameState,
      });
      this.gameState = newGameState;
      this.allocateAndBroadcast();
    } catch (error) {
      // TODO: Broadcast the error
      console.error(error);
    }
  }

  canUndoAction(action: ActionType): boolean {
    switch (action.type) {
      case "startGame":
      case "endTurn":
      case "undo":
        return false;
      case "takeTokens":
      case "placeToken":
        return true;
      default:
        action satisfies never;
        throw new Error("Should not happen");
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
        return this.canTakeTokens(playerId);
      case "placeToken":
        return this.canPlaceToken();
      case "endTurn":
        return this.canEndTurn(playerId);
      case "undo":
        return this.canUndo(playerId);
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
      case "takeTokens":
        return this.takeTokens(playerId, action.payload);
      case "placeToken":
        return this.placeToken(
          playerId,
          action.payload.tokenId,
          action.payload.coords,
        );
      case "endTurn":
        return this.endTurn(playerId);
      case "startGame":
      case "undo":
        break;
      default:
        action satisfies never;
    }
    throw new Error("Should never happen");
  }

  canStartGame(): CanPerformAction {
    return this.isGameStarted()
      ? { ok: false, message: "Game has already started" }
      : { ok: true };
  }

  isGameStarted() {
    return !!this.gameState;
  }

  startGame(): void {
    const playerIdList = shuffle(Object.keys(this.playersById));

    const tokensById = shuffle([...allTokens]).reduce<
      PrivateGameState["tokensById"]
    >((tokensById, color, index) => {
      if (index < 15) {
        const zone = Math.floor(index / 3);
        const place = index % 3;
        const token: TokenType = {
          id: `token-${crypto.randomUUID()}`,
          color,
          type: "centralBoard",
          position: { zone, place },
        };
        tokensById[token.id] = token;
      } else {
        const token: TokenType = {
          id: `token-${crypto.randomUUID()}`,
          color,
          type: "pouch",
        };
        tokensById[token.id] = token;
      }
      return tokensById;
    }, {});

    const animalCardsById = shuffle(Object.entries(animalCards)).reduce<
      PrivateGameState["animalCardsById"]
    >((animalCardsById, [id, animalCard], index) => {
      if (index < 5) {
        const card: AnimalCardType = {
          ...animalCard,
          type: "spread",
          position: { index: index },
        };
        animalCardsById[id] = card;
      } else {
        const card: AnimalCardType = {
          ...animalCard,
          type: "deck",
        };
        animalCardsById[id] = card;
      }
      return animalCardsById;
    }, {});

    const currentPlayerId = playerIdList[0];
    if (!currentPlayerId) throw new Error("No players found");

    this.gameState = {
      boardType: "A",
      playerIdList: playerIdList,
      currentPlayerId: currentPlayerId,
      tokensById: tokensById,
      animalCardsById: animalCardsById,
    };
  }

  canTakeTokens(playerId: string): CanPerformAction {
    return { ok: true };
    for (let i = this.history.length; i > 0; i--) {
      const history = this.history[i - 1];
      if (history.gameState.currentPlayerId !== playerId) {
        break;
      }
      if (history.action.type === "takeTokens") {
        return { ok: false, message: "Already taken tokens" };
      }
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

  canPlaceToken(): CanPerformAction {
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

  canEndTurn(playerId: string): CanPerformAction {
    const hasPlacedAllTokens = this.derivedGameState.players[
      playerId
    ].takenTokens.every((token) => token === null);
    let hasTakenTokens = false;
    for (let i = this.history.length; i > 0; i--) {
      const history = this.history[i - 1];
      if (history.gameState.currentPlayerId !== playerId) {
        return hasTakenTokens && hasPlacedAllTokens
          ? { ok: true }
          : { ok: false, message: "Unfinished turn" };
      }
      if (history.action.type === "takeTokens") {
        hasTakenTokens = true;
      }
    }

    return hasTakenTokens && hasPlacedAllTokens
      ? { ok: true }
      : { ok: false, message: "Unfinished turn" };
  }

  endTurn(playerId: string): ImmutablePrivateGameState {
    // Change to next player
    const index = this.gameState.playerIdList.indexOf(playerId);
    const nextPlayerId =
      this.gameState.playerIdList[
        (index + 1) % this.gameState.playerIdList.length
      ];

    // Replenish central boardType
    let centralBoardZones = [0, 1, 2, 3, 4];
    for (const key in this.gameState.tokensById) {
      const token = this.gameState.tokensById[key];
      if (token.type === "centralBoard") {
        centralBoardZones = centralBoardZones.filter(
          (zone) => zone !== token.position.zone,
        );
      }
    }
    if (centralBoardZones.length !== 1) {
      throw new Error("Invalid central board state");
    }
    const zoneToReplenish = centralBoardZones[0];
    const tokensById = {};
    const tokensToAllocate = 3;
    let place = 0;
    for (const key in this.gameState.tokensById) {
      const token = this.gameState.tokensById[key];
      if (place < tokensToAllocate && token.type === "pouch") {
        const newToken: TokenType = {
          ...token,
          type: "centralBoard",
          position: { zone: zoneToReplenish, place: place },
        };
        tokensById[key] = newToken;
        place++;
      } else {
        tokensById[key] = token;
      }
    }

    return { ...this.gameState, tokensById, currentPlayerId: nextPlayerId };
  }

  canUndo(playerId: string): CanPerformAction {
    const lastHistory = this.history.at(-1);
    if (
      !lastHistory ||
      lastHistory.gameState.currentPlayerId !== playerId ||
      !lastHistory.action.canUndo
    )
      return { ok: false, message: "Cannot undo" };
    return { ok: true };
  }

  allocateAndBroadcast() {
    this.deriveGameState();
    this.broadcast({ type: "gameState", gameState: this.derivedGameState });
  }

  deriveGameState() {
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
        id: playerId,
        name: this.playersById[playerId].name,
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

    const currentPlayerId = this.gameState.currentPlayerId;
    if (!currentPlayerId) throw new Error("No current player");

    const animalCardSpread: DerivedPublicGameState["animalCardSpread"] = [
      null,
      null,
      null,
      null,
      null,
    ];
    for (const key in this.gameState.animalCardsById) {
      const animalCard = this.gameState.animalCardsById[key];
      switch (animalCard.type) {
        case "deck":
          // TODO
          break;
        case "spread":
          animalCardSpread[animalCard.position.index] = animalCard;
          break;
        case "playerBoard":
          // TODO
          break;
        case "playerCompleted":
          // TODO
          break;
        default:
          animalCard satisfies never;
      }
    }

    this.derivedGameState = {
      grid: grid,
      centralBoard: centralBoard,
      players: players,
      currentPlayerId: currentPlayerId,
      animalCardSpread: animalCardSpread,
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
