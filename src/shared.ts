import { z } from "zod";

const colorSchema = z.enum(["blue", "gray", "brown", "green", "yellow", "red"]);
export type ColorType = z.infer<typeof colorSchema>;
export const Color = {
  Blue: "blue",
  Gray: "gray",
  Brown: "brown",
  Green: "green",
  Yellow: "yellow",
  Red: "red",
} as const;

// const tileCoordinateSchema = z.tuple([z.number(), z.number()]);
// export type TileCoordinate = z.infer<typeof tileCoordinateSchema>;

// export const publicTokenSchema = z.object({
//   id: z.string().uuid(),
//   color: colorSchema,
// });
// export type PublicToken = z.infer<typeof publicTokenSchema>;

// const centralBoardPositionSchema = z.object({
//   zone: z.number(),
//   place: z.number(),
// });
// const takenPositionSchema = z.object({
//   player: z.string(),
//   place: z.number(),
// });
// const playerBoardPositionSchema = z.object({
//   player: z.string(),
//   place: z.object({
//     coords: z.string(),
//     position: z.number(),
//   }),
// });
// const privateTokenSchema = z.discriminatedUnion("type", [
//   z
//     .object({
//       type: z.literal("pouch"),
//     })
//     .merge(publicTokenSchema),
//   z
//     .object({
//       type: z.literal("centralBoard"),
//       position: centralBoardPositionSchema,
//     })
//     .merge(publicTokenSchema),
//   z
//     .object({
//       type: z.literal("taken"),
//       position: takenPositionSchema,
//     })
//     .merge(publicTokenSchema),
//   z
//     .object({
//       type: z.literal("playerBoard"),
//       position: playerBoardPositionSchema,
//     })
//     .merge(publicTokenSchema),
// ]);
// export type PrivateToken = z.infer<typeof privateTokenSchema>;

// const cubeSchema = z.enum(["animal", "spirit"]);
// export type CubeType = z.infer<typeof cubeSchema>;
// export const Cube = {
//   Animal: "animal",
//   Spirit: "spirit",
// } as const;

// const tileSchema = z.object({
//   tokens: publicTokenSchema.array(),
//   cube: cubeSchema.nullable(),
// });
// export type Tile = z.infer<typeof tileSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type User = z.infer<typeof userSchema>;

// const centralBoardZoneSchema = z.tuple([
//   publicTokenSchema.nullable(),
//   publicTokenSchema.nullable(),
//   publicTokenSchema.nullable(),
// ]);
// const centralBoardSchema = z.tuple([
//   centralBoardZoneSchema,
//   centralBoardZoneSchema,
//   centralBoardZoneSchema,
//   centralBoardZoneSchema,
//   centralBoardZoneSchema,
// ]);

// export type CentralBoard = z.infer<typeof centralBoardSchema>;

// const playerBoardSchema = z.record(z.string(), tileSchema);

// const playerSchema = z.object({
//   board: playerBoardSchema,
//   takenTokens: z.tuple([
//     publicTokenSchema.nullable(),
//     publicTokenSchema.nullable(),
//     publicTokenSchema.nullable(),
//   ]),
// });

// export const publicGameStateSchema = z.object({
//   grid: z.array(tileCoordinateSchema),
//   playerList: z.array(userSchema),
//   currentPlayerId: z.string().nullable(),
//   boardType: z.enum(["A", "B"]),
//   centralBoard: centralBoardSchema,
//   players: z.record(z.string(), playerSchema),
// });

interface BaseToken {
  id: string;
  color: "blue" | "gray" | "brown" | "green" | "yellow" | "red";
}

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
      type: "placing";
      position: { player: string };
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
  pouch: TokenType[];
}

export interface PublicGameState {
  grid: [number, number][];
  playerList: {
    id: string;
    name: string;
  }[];
  currentPlayerId: string | null;
  boardType: "A" | "B";
  centralBoard: [
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
    [TokenType | null, TokenType | null, TokenType | null],
  ];
  players: Record<
    string,
    {
      board: Record<
        string,
        {
          tokens: TokenType[];
          cube: "animal" | "spirit" | null;
        }
      >;
      takenTokens: [TokenType | null, TokenType | null, TokenType | null];
      placing: TokenType | null;
    }
  >;
}

export interface PersonalPublicGameState extends PublicGameState {
  player: PublicGameState["players"][string];
}

// export type PublicGameState = z.infer<typeof publicGameStateSchema>;

// export const privateGameStateSchema = z.object({
//   tokensById: z.record(z.string(), privateTokenSchema),
//   pouch: z.array(privateTokenSchema),
// });

// export type PrivateGameState = z.infer<typeof privateGameStateSchema>;

export function canPlaceToken(token: TokenType | null, stack: TokenType[]) {
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

  if (stack.length > 2) {
    return false;
  }
}

const startGameActionSchema = z.object({
  type: z.literal("startGame"),
});

const takeTokensSchema = z.object({
  type: z.literal("takeTokens"),
  payload: z.number(),
});

const grabTokenSchema = z.object({
  type: z.literal("grabToken"),
  payload: z.object({
    takenIndex: z.number(),
  }),
});

const placeTokenSchema = z.object({
  type: z.literal("placeToken"),
  payload: z.object({
    coords: z.string(),
  }),
});

export const actionSchema = z.union([
  startGameActionSchema,
  // addPlayerActionSchema,
  takeTokensSchema,
  grabTokenSchema,
  placeTokenSchema,
]);

export type ActionType = z.infer<typeof actionSchema>;
