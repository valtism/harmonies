import { ColorType, DerivedPublicGameState } from "../src/shared";

export const Color = {
  Blue: "blue",
  Gray: "gray",
  Brown: "brown",
  Green: "green",
  Yellow: "yellow",
  Red: "red",
} satisfies Record<string, ColorType>;

export const allTokens = [
  ...Array.from({ length: 23 }).map(() => Color.Blue),
  ...Array.from({ length: 23 }).map(() => Color.Gray),
  ...Array.from({ length: 21 }).map(() => Color.Brown),
  ...Array.from({ length: 19 }).map(() => Color.Green),
  ...Array.from({ length: 19 }).map(() => Color.Yellow),
  ...Array.from({ length: 15 }).map(() => Color.Red),
];

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

export const grids: Record<"A" | "B", DerivedPublicGameState["grid"]> = {
  A: gridA,
  // TODO: add Grid B
  B: gridA,
};
