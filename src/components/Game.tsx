import { defineHex, Grid, Orientation, TupleCoordinates } from "honeycomb-grid";
import { useReducer, useState } from "react";
import BoardSideA from "src/assets/boardSideA.webp";
import clsx from "clsx";
import usePartySocket from "partysocket/react";

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

const allTiles = [
  ...Array.from({ length: 23 }).map(() => Token.Blue),
  ...Array.from({ length: 23 }).map(() => Token.Gray),
  ...Array.from({ length: 21 }).map(() => Token.Brown),
  ...Array.from({ length: 19 }).map(() => Token.Green),
  ...Array.from({ length: 19 }).map(() => Token.Yellow),
  ...Array.from({ length: 15 }).map(() => Token.Red),
];

function shuffle<T>(array: T[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const defaultWidth = 726;

type CentralBoard = {
  0: Token[];
  1: Token[];
  2: Token[];
  3: Token[];
  4: Token[];
};

const initialState: {
  players: string[];
  currentPlayer: string | null;
  board: "A" | "B";
  bag: Token[];
  centralBoard: CentralBoard;
  playerBoards: [][];
} = {
  players: [],
  currentPlayer: null,
  board: "A",
  bag: [],
  centralBoard: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  },
  playerBoards: [],
};

type ActionType =
  | { type: "addPlayer"; payload: string }
  | { type: "startGame"; payload: string };

export function Game() {
  const [width, setWidth] = useState(defaultWidth);

  const [serverState, dispatch] = useReducer((state, action: ActionType) => {
    switch (action.type) {
      case "addPlayer":
        const playerId = crypto.randomUUID();
        return {
          ...state,
          players: [...state.players, playerId],
        };
      case "startGame":
        if (state.players.length === 0) return state;

        const bag = shuffle(allTiles);
        const centralBoard: CentralBoard = {
          0: bag.splice(0, 3),
          1: bag.splice(0, 3),
          2: bag.splice(0, 3),
          3: bag.splice(0, 3),
          4: bag.splice(0, 3),
        };

        return {
          ...state,
          bag: bag,
          centralBoard: centralBoard,
        };
      default:
        action satisfies never;
        return state;
    }
  }, initialState);

  const Hex = defineHex({
    dimensions: width / 14,
    orientation: Orientation.FLAT,
    origin: "topLeft",
  });

  // const coordinates: TupleCoordinates[] = jsonGrid.coordinates.map(
  //   ({ q, r }) => [q, r]
  // );

  const grid = new Grid(Hex, gridA);

  const [token, setToken] = useState<Token | null>(null);

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

  const socket = usePartySocket({
    // host defaults to the current URL if not set
    //host: process.env.PARTYKIT_HOST,
    // we could use any room name here
    host: "localhost:1999",
    room: "hello",
    onMessage(evt) {
      console.log("onMessage");
      console.log(evt);
    },
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
      <button
        onClick={() => dispatch({ type: "addPlayer", payload: "Player 1" })}
        className="text-white"
      >
        Add Player
      </button>
      <div className="text-white">Players: {serverState.players}</div>
      <button
        className="text-white"
        onClick={() => {
          console.log("hellos");

          socket.send("hello");
        }}
      >
        Party
      </button>
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
