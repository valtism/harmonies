import { ColorType, DerivedPublicGameState } from "../src/sharedTypes";

export const allTokens: ColorType[] = [
  ...Array.from({ length: 23 }).map(() => "blue" as const),
  ...Array.from({ length: 23 }).map(() => "gray" as const),
  ...Array.from({ length: 21 }).map(() => "brown" as const),
  ...Array.from({ length: 19 }).map(() => "green" as const),
  ...Array.from({ length: 19 }).map(() => "yellow" as const),
  ...Array.from({ length: 15 }).map(() => "red" as const),
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
