import { z } from "zod";

export const Color = {
  Blue: "blue",
  Gray: "gray",
  Brown: "brown",
  Green: "green",
  Yellow: "yellow",
  Red: "red",
} as const;
export type ColorType = (typeof Color)[keyof typeof Color];

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type User = z.infer<typeof userSchema>;

type BaseToken = {
  id: string;
  color: "blue" | "gray" | "brown" | "green" | "yellow" | "red";
};
export type TokenType =
  | (BaseToken & {
      type: "pouch";
    })
  | (BaseToken & {
      type: "centralBoard";
      position: { zone: number; place: number };
    })
  | (BaseToken & {
      type: "taken";
      position: { player: string; place: number };
    })
  | (BaseToken & {
      type: "playerBoard";
      position: {
        player: string;
        place: { coords: string; stackPostion: number };
      };
    });

export interface PrivateGameState {
  tokensById: Record<string, TokenType>;
  boardType: "A" | "B";
  playerIdList: string[];
  currentPlayerId: string | null;
}

interface PlayerState {
  board: Record<
    string,
    {
      tokens: TokenType[];
      cube: "animal" | "spirit" | null;
    }
  >;
  takenTokens: [TokenType | null, TokenType | null, TokenType | null];
}

export interface DerivedPublicGameState {
  grid: [number, number][];
  centralBoard: [
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
  ];
  players: Record<string, PlayerState>;
  player: PlayerState;
}

export function canPlaceToken(
  token: TokenType | null,
  stack: TokenType[],
): boolean {
  if (!token) return false;
  const topToken = stack.at(-1);

  if (!topToken) {
    return true;
  }

  if (stack.length === 1) {
    switch (token.color) {
      case Color.Blue:
      case Color.Yellow:
        return false;
      case Color.Gray:
        return topToken.color === Color.Gray;
      case Color.Brown:
        return topToken.color === Color.Brown;
      case Color.Green:
        return topToken.color === Color.Brown;
      case Color.Red:
        return [Color.Gray, Color.Brown, Color.Red].includes(topToken.color);
      default:
        token.color satisfies never;
        return false;
    }
  }

  if (stack.length === 2) {
    switch (token.color) {
      case Color.Blue:
      case Color.Yellow:
      case Color.Brown:
      case Color.Red:
        return false;
      case Color.Gray:
        return topToken.color === Color.Gray;
      case Color.Green:
        return topToken.color === Color.Brown;
      default:
        token.color satisfies never;
        return false;
    }
  }

  return false;
}

const startGameActionSchema = z.object({
  type: z.literal("startGame"),
});

const takeTokensSchema = z.object({
  type: z.literal("takeTokens"),
  payload: z.number(),
});

const placeTokenSchema = z.object({
  type: z.literal("placeToken"),
  payload: z.object({
    tokenId: z.string(),
    coords: z.string(),
  }),
});

export const actionSchema = z.union([
  startGameActionSchema,
  takeTokensSchema,
  placeTokenSchema,
]);

export type ActionType = z.infer<typeof actionSchema>;

export interface History {
  action: ActionType;
  privateGameState: PrivateGameState;
  publicGameStat: DerivedPublicGameState;
}

export type PlayersById = Record<string, User>;

export type Broadcast =
  | {
      type: "players";
      players: PlayersById;
    }
  | {
      type: "gameState";
      gameState: DerivedPublicGameState;
    };
