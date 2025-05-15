import clsx from "clsx";
import { defineHex, Grid, Orientation } from "honeycomb-grid";
import BoardSideA from "src/assets/boardSideA.webp";
import { Token } from "src/components/Token";
import { ActionType, canPlaceToken, PersonalPublicGameState } from "src/shared";

const width = 726;

interface PlayerBoardProps {
  gameState: PersonalPublicGameState;
  sendAction: (action: ActionType) => void;
}
export function PlayerBoard({ gameState, sendAction }: PlayerBoardProps) {
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
        {Array.from(grid).map((hex) => {
          const key = hex.toString();
          const tile = gameState.player.board[key];
          const tokens = tile?.tokens || [];
          const topToken = tokens.at(-1);
          const tokenPlacable = canPlaceToken(gameState.player.placing, tokens);

          return (
            <div
              key={key}
              onClick={() => {
                if (!tokenPlacable) return;
                sendAction({
                  type: "placeToken",
                  payload: {
                    coords: key,
                  },
                });
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
              style={{
                top: hex.r * (width / 242) + width / 182 + hex.y,
                left: hex.q * (width / 242) + width / 7.5 + hex.x,
                width: hex.width,
                height: hex.height,
                backgroundColor: topToken?.color,
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
      <div
        className="absolute bg-black/20 flex flex-col gap-2"
        style={{
          width: "10%",
          height: "30%",
          left: "84%",
          top: "10%",
        }}
      >
        {gameState.player.takenTokens.map((token, index) => {
          if (!token) return;
          return (
            <button
              key={token.id}
              onClick={() => {
                sendAction({
                  type: "grabToken",
                  payload: { takenIndex: index },
                });
              }}
            >
              <Token token={token} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
