import "@total-typescript/ts-reset";
import type * as Party from "partykit/server";
import {
  History,
  ImmutablePrivateGameState,
  DerivedPublicGameState,
  actionSchema,
  userSchema,
  PlayersById,
  Broadcast,
  ActionType,
} from "../src/shared";
import { placeToken, startGame, takeTokens } from "./actionApplyFunctions";
import { grids } from "./constants";

type StatefulPartyConnection = Party.Connection<{ playerId: string }>;

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
    try {
      const newGameState = this.newStateFromAction(playerId, action);
      this.history.push({
        action: action,
        gameState: newGameState,
      });
      this.gameState = newGameState;
      this.allocateAndBroadcast(playerId);
    } catch (error) {
      console.error(error);
      // TODO: Broadcast the error
    }
  }

  newStateFromAction(
    playerId: string,
    action: ActionType,
  ): ImmutablePrivateGameState {
    switch (action.type) {
      case "startGame":
        return startGame(this.playersById);
      case "takeTokens":
        // if (!isPlayerTurn) {
        //   throw new Error("Not your turn");
        // }
        return takeTokens(this.gameState, playerId, action.payload);
      case "placeToken":
        return placeToken(
          this.gameState,
          playerId,
          action.payload.tokenId,
          action.payload.coords,
        );
      default:
        action satisfies never;
    }
    throw new Error("Should never happen");
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
