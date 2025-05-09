import { z } from "zod";

const tupleCoordinatesSchema = z.array(z.tuple([z.number(), z.number()]));
export type TupleCoordinates = z.infer<typeof tupleCoordinatesSchema>;

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

export const tokenSchema = z.object({
  id: z.string().uuid(),
  color: colorSchema,
});
export type TokenType = z.infer<typeof tokenSchema>;

const cubeSchema = z.enum(["animal", "spirit"]);
export type CubeType = z.infer<typeof cubeSchema>;
export const Cube = {
  Animal: "animal",
  Spirit: "spirit",
} as const;

const tileSchema = z.object({
  tokens: tokenSchema.array(),
  cube: cubeSchema.nullable(),
});
export type Tile = z.infer<typeof tileSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type User = z.infer<typeof userSchema>;

const centralBoardSchema = z.tuple([
  z.tuple([tokenSchema, tokenSchema, tokenSchema]).nullable(),
  z.tuple([tokenSchema, tokenSchema, tokenSchema]).nullable(),
  z.tuple([tokenSchema, tokenSchema, tokenSchema]).nullable(),
  z.tuple([tokenSchema, tokenSchema, tokenSchema]).nullable(),
  z.tuple([tokenSchema, tokenSchema, tokenSchema]).nullable(),
]);

export type CentralBoard = z.infer<typeof centralBoardSchema>;

export const publicGameStateSchema = z.object({
  grid: tupleCoordinatesSchema,
  players: z.array(userSchema),
  currentPlayerId: z.string().nullable(),
  board: z.enum(["A", "B"]),
  centralBoard: centralBoardSchema,
  playerBoards: z.record(z.string(), z.record(z.string(), tileSchema)),
});

export type PublicGameState = z.infer<typeof publicGameStateSchema>;

export const privateGameStateSchema = z.object({
  bag: z.array(tokenSchema),
});

export type PrivateGameState = z.infer<typeof privateGameStateSchema>;

const startGameActionSchema = z.object({
  type: z.literal("startGame"),
});

const addPlayerActionSchema = z.object({
  type: z.literal("addPlayer"),
  payload: z.string(),
});

export const actionSchema = z.union([
  startGameActionSchema,
  addPlayerActionSchema,
]);

export type ActionType = z.infer<typeof actionSchema>;
