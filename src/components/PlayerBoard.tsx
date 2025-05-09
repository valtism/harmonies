import clsx from "clsx";
import { defineHex, Grid, Orientation } from "honeycomb-grid";
import PartySocket from "partysocket";
import BoardSideA from "src/assets/boardSideA.webp";
import { User } from "src/routes/$roomId";
import { Color, PublicGameState, TokenType } from "src/shared";

const width = 726;

interface PlayerBoardProps {
  gameState: PublicGameState;
  user: User;
  token: TokenType | null;
  socket: PartySocket;
}
export function PlayerBoard({
  gameState,
  user,
  token,
  socket,
}: PlayerBoardProps) {
  const Hex = defineHex({
    dimensions: width / 14,
    orientation: Orientation.FLAT,
    origin: "topLeft",
  });

  const grid = new Grid(Hex, gameState.grid);

  return (
    <div className="relative inline-block">
      <img src={BoardSideA} alt="player board" width={width} />
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
                backgroundColor: topToken?.color,
              }}
              className={clsx(
                "absolute size-10 hover:bg-black/50! hexagon p-4 text-[8px] select-none",
                tokenPlacable && "ring-4 ring-green-500 shadow-2xl bg-white/50!"
              )}
            >
              {JSON.stringify(tile, null, 2)}
            </div>
          );
        })}
      </div>
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
