import clsx from "clsx";
import { defineHex, Grid, Orientation } from "honeycomb-grid";
import { startTransition, useEffect, useRef, useState } from "react";
import BoardSideA from "src/assets/boardSideA.webp";
import { PlacingToken } from "src/components/PlacingToken";
import { Token } from "src/components/Token";
import {
  ActionType,
  DerivedPublicGameState,
  tokenPlacable,
  TokenType,
} from "src/sharedTypes";

interface PlayerBoardProps {
  playerId: string;
  gameState: DerivedPublicGameState;
  sendAction: (action: ActionType) => void;
}
export function PlayerBoard({
  playerId,
  gameState,
  sendAction,
}: PlayerBoardProps) {
  const player = gameState.players[playerId];
  if (!player) throw new Error("Player not found");

  const [placingToken, setPlacingToken] = useState<TokenType | null>(null);
  // Unset placingToken only once server has placed the token on the board
  // Need to do this to make ViewTransition work smoothly.
  if (
    Object.values(player.board).some(({ tokens }) =>
      tokens.some((token) => token.id === placingToken?.id),
    )
  ) {
    setPlacingToken(null);
  }

  useEffect(() => {
    const handleKey = ({ key }: KeyboardEvent) => {
      if (key === "Escape" && placingToken) {
        setPlacingToken(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [placingToken]);

  const [width, setWidth] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const divRef = ref.current;
    const updateWidth = () => {
      const rect = divRef.getBoundingClientRect();
      setWidth(rect.width);
    };
    updateWidth();
    divRef.addEventListener("resize", updateWidth);
    return () => {
      divRef.removeEventListener("resize", updateWidth);
    };
  }, []);

  const Hex = defineHex({
    dimensions: width / 14,
    orientation: Orientation.FLAT,
    origin: "topLeft",
  });
  const grid = new Grid(Hex, gameState.grid);

  return (
    <div ref={ref} className="relative inline-block">
      <img src={BoardSideA} alt="player board" />

      <div className="absolute inset-0 rotate-[0.5deg]">
        {Array.from(grid).map((hex) => {
          const key = hex.toString();
          const tile = player.board[key];
          const tokens = tile?.tokens || [];
          const isTokenPlacable = tokenPlacable(placingToken, tokens);

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
                  onClick={async () => {
                    if (!placingToken || !isTokenPlacable) return;
                    startTransition(() => {
                      sendAction({
                        type: "placeToken",
                        payload: {
                          coords: key,
                          tokenId: placingToken.id,
                        },
                      });
                      // setPlacingToken(null);
                    });
                  }}
                  className={clsx(
                    "hexagon absolute inset-0 cursor-[unset] hover:bg-black/20",
                    isTokenPlacable && "bg-white/20",
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
          width: "7%",
          height: "30%",
          left: "84%",
          top: "10%",
        }}
      >
        {player.takenTokens.map((token, index) => {
          if (!token) return;
          if (token.id === placingToken?.id) return null;
          return (
            <button
              key={token.id}
              onClick={() => setPlacingToken(token)}
              style={{
                position: "absolute",
                top: `${index * (100 / 3)}%`,
              }}
            >
              <Token token={token} />
            </button>
          );
        })}
      </div>
      <PlacingToken token={placingToken} />
    </div>
  );
}
