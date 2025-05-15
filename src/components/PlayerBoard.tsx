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

      <div className="absolute inset-0 rotate-[0.5deg]">
        {Array.from(grid).map((hex) => {
          const key = hex.toString();
          const tile = gameState.player.board[key];
          const tokens = tile?.tokens || [];
          const tokenPlacable = canPlaceToken(gameState.player.placing, tokens);

          return (
            <div
              key={key}
              style={{
                position: "absolute",
                top: hex.r * (width / 242) + width / 182 + hex.y,
                left: hex.q * (width / 242) + width / 7.5 + hex.x,
                width: hex.width,
                height: hex.height,
              }}
            >
              <div className="relative flex size-full items-end justify-center pb-4">
                {tokens.map((token, index) => (
                  <Token
                    key={token.id}
                    token={token}
                    style={{
                      position: "absolute",
                      width: "50%",
                      height: "50%",
                      translate: `0 -${index * 30}%`,
                    }}
                  />
                ))}
                <button
                  onClick={() => {
                    if (!tokenPlacable) return;
                    sendAction({
                      type: "placeToken",
                      payload: {
                        coords: key,
                      },
                    });
                  }}
                  className={clsx(
                    "hexagon absolute inset-0 cursor-[unset] hover:bg-black/20",
                    tokenPlacable && "bg-white/20",
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="absolute flex flex-col gap-2 bg-black/20"
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
