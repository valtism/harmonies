import clsx from "clsx";
import { defineHex, Grid, Orientation } from "honeycomb-grid";
import PartySocket from "partysocket";
import { useState } from "react";
import BoardSideA from "src/assets/boardSideA.webp";
import { User } from "src/routes/$roomId";
import { GameState, Token, TokenType } from "src/shared";

const defaultWidth = 726;

interface GameProps {
  gameState: GameState;
  socket: PartySocket;
  // roomId: string;
  user: User;
}
export function Game({ gameState, socket, user }: GameProps) {
  console.log(gameState, user);

  const [width, setWidth] = useState(defaultWidth);

  const Hex = defineHex({
    dimensions: width / 14,
    orientation: Orientation.FLAT,
    origin: "topLeft",
  });

  // const coordinates: TupleCoordinates[] = jsonGrid.coordinates.map(
  //   ({ q, r }) => [q, r]
  // );

  const grid = new Grid(Hex, gameState.grid);

  const [token, setToken] = useState<TokenType | null>(null);

  // const [myTiles, setMyTiles] = useState(() => {
  //   const tiles: Record<string, Tile> = {};
  //   Array.from(grid).forEach((tile) => {
  //     const key = `${tile.q}-${tile.r}`;
  //     tiles[key] = {
  //       tokens: [],
  //       cube: null,
  //     };
  //   });
  //   return tiles;
  // });

  return (
    <div className="mb-60">
      <div className="relative inline-block">
        <img src={BoardSideA} alt="board" width={width} />
        <div className="absolute rotate-[0.5deg] inset-0">
          {Array.from(grid).map((hexes) => {
            const key = `${hexes.q}-${hexes.r}`;
            const tile = gameState.playerBoards[user.id]?.[key];
            const tokens = tile?.tokens || [];
            const topToken = tokens.at(-1);
            const tokenPlacable = canPlaceToken(token, tokens);

            return (
              <div
                onClick={() => {
                  if (!token) return;
                  if (!tokenPlacable) return;

                  socket.send(JSON.stringify({ type: "place", token: token }));
                  // const newTiles = { ...myTiles };
                  // // Token
                  // const newTokens = [...tile.tokens, token];
                  // newTiles[key] = {
                  //   ...myTiles[key],
                  //   tokens: newTokens,
                  // };
                  // setToken(null);
                  // setMyTiles(newTiles);
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
                    "ring-4 ring-green-500 shadow-2xl bg-white/50!",
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
      <div className="flex gap-1">
        <div className="text-white font-bold">Current Token: </div>
        <div>{token}</div>
      </div>
      {/* <button
        onClick={() =>
          socket.send(
            JSON.stringify({ type: "addPlayer", payload: "Player 1" }),
          )
        }
        className="text-white"
      >
        Add Player
      </button> */}
      <div className="text-white">
        <div className="font-bold">Players:</div>
        {gameState.players.map((player) => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
      <button
        className="bg-stone-100 hover:bg-stone-300 text-stone-900 px-2 py-1 rounded"
        onClick={() => {
          socket.send(
            JSON.stringify({
              type: "a",
            }),
          );
        }}
      >
        Start Game
      </button>
    </div>
  );
}

function canPlaceToken(token: TokenType | null, stack: TokenType[]) {
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
