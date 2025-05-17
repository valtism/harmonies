import {
  DeepImmutable,
  PlayersById,
  ImmutablePrivateGameState,
  TokenType,
  PrivateGameState,
  canPlaceToken,
} from "../src/shared";
import { allTokens } from "./constants";

function shuffle<T>(array: T[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function startGame(
  playersById: DeepImmutable<PlayersById>,
): ImmutablePrivateGameState {
  const playerIdList = shuffle(Object.keys(playersById));

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

export function takeTokens(
  gameState: ImmutablePrivateGameState,
  playerId: string,
  zone: number,
): ImmutablePrivateGameState {
  const tokensById: PrivateGameState["tokensById"] = {};
  let place = 0;
  for (const id in gameState.tokensById) {
    const token = gameState.tokensById[id];
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
    ...gameState,
    tokensById,
  };
}

export function placeToken(
  gameState: ImmutablePrivateGameState,
  playerId: string,
  tokenId: string,
  coords: string,
): ImmutablePrivateGameState {
  const placingToken = gameState.tokensById[tokenId];
  if (!placingToken) throw new Error("No token found");
  if (
    placingToken.type !== "taken" ||
    placingToken.position.player !== playerId
  ) {
    throw new Error("Invalid token");
  }

  const stack: TokenType[] = [];
  for (const key in gameState.tokensById) {
    const token = gameState.tokensById[key];
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

  const tokensById: PrivateGameState["tokensById"] = {};
  for (const id in gameState.tokensById) {
    if (id !== tokenId) {
      const token = gameState.tokensById[id];
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
    ...gameState,
    tokensById,
  };
}
