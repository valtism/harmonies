import { defineHex, Grid, Orientation, TupleCoordinates } from "honeycomb-grid";
import { useState } from "react";
import BoardSideA from "./assets/boardSideA.webp";
import clsx from "clsx";

const gridA: TupleCoordinates[] = [
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

const Token = {
  Blue: "blue",
  Gray: "gray",
  Brown: "brown",
  Green: "green",
  Yellow: "yellow",
  Red: "red",
} as const;
type Token = (typeof Token)[keyof typeof Token];
const Cubes = {
  Animal: "animal",
  Spirit: "spirit",
} as const;
type Cube = (typeof Cubes)[keyof typeof Cubes];

interface Tile {
  tokens: Token[];
  cube: Cube | null;
}

const defaultWidth = 726;

export default function App() {
  const [width, setWidth] = useState(defaultWidth);
  const [token, setToken] = useState<Token | null>(null);

  const Hex = defineHex({
    dimensions: width / 14,
    orientation: Orientation.FLAT,
    origin: "topLeft",
  });

  const grid = new Grid(Hex, gridA);

  const [myTiles, setMyTiles] = useState(() => {
    const tiles: Record<string, Tile> = {};
    Array.from(grid).forEach((tile) => {
      const key = `${tile.q}-${tile.r}`;
      tiles[key] = {
        tokens: [],
        cube: null,
      };
    });
    return tiles;
  });

  return (
    <div>
      <div className="relative inline-block">
        <img src={BoardSideA} alt="board" width={width} />
        <div className="absolute rotate-[0.5deg] inset-0">
          {Array.from(grid).map((hexes) => {
            const key = `${hexes.q}-${hexes.r}`;
            const tile = myTiles[key];
            const topToken = tile.tokens.at(-1);
            const tokenPlacable = canPlaceToken(token, tile.tokens);

            return (
              <div
                onClick={() => {
                  const newTiles = { ...myTiles };
                  // Token
                  if (!token) return;
                  if (!canPlaceToken(token, tile.tokens)) return;
                  const newTokens = [...tile.tokens, token];
                  newTiles[key] = {
                    ...myTiles[key],
                    tokens: newTokens,
                  };
                  setToken(null);
                  setMyTiles(newTiles);
                }}
                key={key}
                style={{
                  top: hexes.r * (width / 242) + width / 182 + hexes.y,
                  left: hexes.q * (width / 242) + width / 7.5 + hexes.x,
                  width: hexes.width,
                  height: hexes.height,
                  backgroundColor: topToken,
                }}
                className={clsx(
                  "absolute size-10 hover:bg-black/50! hexagon p-4 text-[8px] select-none",
                  tokenPlacable &&
                    "ring-4 ring-green-500 shadow-2xl bg-white/50!"
                )}
              >
                {JSON.stringify(tile, null, 2)}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex">
        {Object.values(Token).map((token) => (
          <button
            key={token}
            onClick={() => setToken(token)}
            className="border border-gray-400 rounded px-4 py-2 text-white hover:bg-gray-600"
          >
            {token}
          </button>
        ))}
        <button
          key={token}
          onClick={() => setToken(null)}
          className="border border-gray-400 rounded px-4 py-2 text-white hover:bg-gray-600"
        >
          null
        </button>
      </div>
      <div className="text-white">Current Token: {token}</div>
    </div>
  );
}

function canPlaceToken(token: Token | null, stack: Token[]) {
  if (!token) return false;
  const topToken = stack.at(-1);

  if (!topToken) {
    return true;
  }

  if (stack.length === 1) {
    switch (token) {
      case Token.Blue:
      case Token.Yellow:
        return false;
      case Token.Gray:
        return topToken === Token.Gray;
      case Token.Brown:
        return topToken === Token.Brown;
      case Token.Green:
        return topToken === Token.Brown;
      case Token.Red:
        return [Token.Gray, Token.Brown, Token.Red].includes(topToken);
      default:
        token satisfies never;
        return false;
    }
  }

  if (stack.length === 2) {
    switch (token) {
      case Token.Blue:
      case Token.Yellow:
      case Token.Brown:
      case Token.Red:
        return false;
      case Token.Gray:
        return topToken === Token.Gray;
      case Token.Green:
        return topToken === Token.Brown;
      default:
        token satisfies never;
        return false;
    }
  }

  if (stack.length > 2) {
    return false;
  }
}
