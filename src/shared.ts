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
      type: "playerBoard";
      position: {
        player: string;
        place: { coords: string; stackPostion: number };
      };
    });

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
    }
  >;
}

export interface PrivateGameState {
  tokensById: Record<string, TokenType>;
  pouch: TokenType[];
}

// export type PublicGameState = z.infer<typeof publicGameStateSchema>;

// export const privateGameStateSchema = z.object({
//   tokensById: z.record(z.string(), privateTokenSchema),
//   pouch: z.array(privateTokenSchema),
// });

// export type PrivateGameState = z.infer<typeof privateGameStateSchema>;

const startGameActionSchema = z.object({
  type: z.literal("startGame"),
});

// const addPlayerActionSchema = z.object({
//   type: z.literal("addPlayer"),
//   payload: z.string(),
// });

const takeTokensSchema = z.object({
  type: z.literal("takeTokens"),
  payload: z.number(),
});

export const actionSchema = z.union([
  startGameActionSchema,
  // addPlayerActionSchema,
  takeTokensSchema,
]);

export type ActionType = z.infer<typeof actionSchema>;
