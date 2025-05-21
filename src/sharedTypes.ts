import { z } from "zod/v4";

export type DeepImmutable<T> =
  T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>>
    : T extends Set<infer S>
      ? ReadonlySet<DeepImmutable<S>>
      : T extends object
        ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
        : T;

export type ColorType = "blue" | "gray" | "brown" | "green" | "yellow" | "red";

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

export type ImmutablePrivateGameState = DeepImmutable<PrivateGameState>;

interface PlayerState {
  id: string;
  name: string;
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
  currentPlayerId: string;
}

export function tokenPlacable(
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
      case "blue":
      case "yellow":
        return false;
      case "gray":
        return topToken.color === "gray";
      case "brown":
        return topToken.color === "brown";
      case "green":
        return topToken.color === "brown";
      case "red":
        return ["gray", "brown", "red"].includes(topToken.color);
      default:
        token.color satisfies never;
        return false;
    }
  }

  if (stack.length === 2) {
    switch (token.color) {
      case "blue":
      case "yellow":
      case "brown":
      case "red":
        return false;
      case "gray":
        return topToken.color === "gray";
      case "green":
        return topToken.color === "brown";
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

const endTurnSchema = z.object({
  type: z.literal("endTurn"),
});

const undoSchema = z.object({
  type: z.literal("undo"),
});

export const actionSchema = z.union([
  startGameActionSchema,
  takeTokensSchema,
  placeTokenSchema,
  endTurnSchema,
  undoSchema,
]);

export type ActionType = z.infer<typeof actionSchema>;

type ActionHistory = ActionType & {
  // playerId: string;
  canUndo: boolean;
};

export interface History {
  action: ActionHistory;
  gameState: ImmutablePrivateGameState;
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
    }
  | {
      type: "error";
      playerId: string;
      message: string;
    };

export type CanPerformAction = { ok: true } | { ok: false; message: string };
