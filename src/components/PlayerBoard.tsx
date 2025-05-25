import clsx from "clsx";
import { defineHex, fromCoordinates, Grid, Orientation } from "honeycomb-grid";
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

const debug = true;

const butterfly = {
  name: "Butterfly",
  shape: [
    {
      coords: { q: 0, r: 0 },
      tokens: ["yellow"],
    },
    {
      coords: { q: 1, r: 0 },
      tokens: ["blue"],
    },
    {
      coords: { q: 0, r: 1 },
      tokens: ["blue"],
    },
    {
      coords: { q: 1, r: 1 },
      tokens: ["yellow"],
    },
  ],
};

type Coords = { q: number; r: number };

function rotate(coords: Readonly<Coords>, steps: number): Coords {
  let newCoords = coords;
  for (let i = 0; i < steps; i++) {
    newCoords = rotateOnce(newCoords);
  }
  return newCoords;
}

function rotateOnce(coords: Readonly<Coords>): Coords {
  const s = -coords.q - coords.r;
  return { q: -coords.r, r: -s };
}

function translate(coords: Readonly<Coords>, delta: Readonly<Coords>): Coords {
  return { q: coords.q + delta.q, r: coords.r + delta.r };
}

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
  gameState.players[playerId]!.board["(1,1)"] = {
    cube: null,
    tokens: [
      {
        id: crypto.randomUUID(),
        color: "yellow",
        type: "playerBoard",
        position: {
          player: playerId,
          place: { coords: "(1,1)", stackPostion: 0 },
        },
      },
    ],
  };
  gameState.players[playerId]!.board["(2,0)"] = {
    cube: null,
    tokens: [
      {
        id: crypto.randomUUID(),
        color: "blue",
        type: "playerBoard",
        position: {
          player: playerId,
          place: { coords: "(2,0)", stackPostion: 0 },
        },
      },
    ],
  };
  gameState.players[playerId]!.board["(2,1)"] = {
    cube: null,
    tokens: [
      {
        id: crypto.randomUUID(),
        color: "blue",
        type: "playerBoard",
        position: {
          player: playerId,
          place: { coords: "(2,1)", stackPostion: 0 },
        },
      },
    ],
  };
  gameState.players[playerId]!.board["(3,0)"] = {
    cube: null,
    tokens: [
      {
        id: crypto.randomUUID(),
        color: "yellow",
        type: "playerBoard",
        position: {
          player: playerId,
          place: { coords: "(3,0)", stackPostion: 0 },
        },
      },
    ],
  };

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

          const positions = butterfly.shape.map((tile) => tile.coords);
          const rotations = [0, 1, 2, 3, 4, 5].map((rotation) =>
            positions.map((position) => rotate(position, rotation)),
          );
          const relativePositions = rotations.map((roatation) =>
            roatation.map((coords) =>
              translate(coords, { q: hex.q, r: hex.r }),
            ),
          );
          const traversers = relativePositions.map((positions) =>
            fromCoordinates(...positions),
          );

          const matches = traversers.map((traverser) => {
            const trav = grid.traverse(traverser, { bail: false }).toArray();
            // TODO: Make me dynamic
            if (trav.length !== 4) return false;

            return trav.reduce((isMatch, hex, index) => {
              const hexTokens =
                gameState.players[playerId]!.board[hex.toString()]!.tokens;
              const shapeTokens = butterfly.shape[index]!.tokens;
              const stackMatch =
                hexTokens.length === shapeTokens.length &&
                hexTokens.every((token, i) => token.color === shapeTokens[i]);
              return isMatch && stackMatch;
            }, true);
          });
          const hasMatch = matches.some((match) => match);

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
                {debug && (
                  <div className="pointer-events-none z-10 font-black text-white text-shadow-lg">
                    {key}
                  </div>
                )}
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
                    });
                  }}
                  className={clsx(
                    "hexagon absolute inset-0 cursor-[unset] hover:bg-black/20",
                    isTokenPlacable && "bg-white/20",
                  )}
                />
                {hasMatch && (
                  <div className="absolute inset-0 size-full bg-green-500/20" />
                )}
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
