import clsx from "clsx";
import {
  defineHex,
  fromCoordinates,
  Grid,
  Hex,
  Orientation,
} from "honeycomb-grid";
import { startTransition, useEffect, useRef, useState } from "react";
import BoardSideA from "src/assets/boardSideA.webp";
import { AnimalCard } from "src/components/AnimalCard";
import { PlacingToken } from "src/components/PlacingToken";
import { Token } from "src/components/Token";
import {
  ActionType,
  DerivedPublicGameState,
  tokenPlacable,
  TokenType,
} from "src/sharedTypes";

const debug = true;

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

  const [selectedAnimalCardId, setSelectedAnimalCardId] = useState<
    string | null
  >(null);

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
  player.board["(1,1)"] = {
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
  player.board["(2,0)"] = {
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
  player.board["(2,1)"] = {
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
  player.board["(3,0)"] = {
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
    <div>
      {debug && (
        <div className="flex">
          <div>Animal Card Id:</div>
          <div>{selectedAnimalCardId}</div>
        </div>
      )}
      <div className="my-2 flex gap-2">
        {player.animalCards.map((card, index) => (
          <div
            key={card?.id || index}
            className="flex-1"
            style={{ aspectRatio: "140/240" }}
          >
            {card ? (
              <button
                onClick={() => {
                  if (selectedAnimalCardId === card.id) {
                    setSelectedAnimalCardId(null);
                  } else {
                    setSelectedAnimalCardId(card.id);
                  }
                }}
                className={clsx(
                  selectedAnimalCardId === card.id &&
                    "rounded ring-3 ring-green-500",
                )}
              >
                <AnimalCard card={card} />
              </button>
            ) : (
              <div className="h-full rounded-lg border border-dotted" />
            )}
          </div>
        ))}
      </div>
      <div ref={ref} className="relative inline-block">
        <img src={BoardSideA} alt="player board" />

        <div className="absolute inset-0 rotate-[0.5deg]">
          {Array.from(grid).map((hex) => {
            const key = hex.toString();
            const tile = player.board[key];
            const tokens = tile?.tokens || [];
            const isTokenPlacable = tokenPlacable(placingToken, tokens);

            const hasMatch = getIsMatch(
              player.animalCards.find(
                (card) => card?.id === selectedAnimalCardId,
              ),
              grid,
              hex,
              player.board,
            );

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
            height: "20%",
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
    </div>
  );
}

function getIsMatch(
  animalCard:
    | DerivedPublicGameState["players"][number]["animalCards"][number]
    | undefined
    | null,
  grid: Grid<Hex>,
  hex: Coords,
  playerBoard: DerivedPublicGameState["players"][number]["board"],
) {
  if (!animalCard) return false;

  const positions = animalCard.shape.map((tile) => tile.coordinates);
  const rotations = [0, 1, 2, 3, 4, 5].map((rotation) =>
    positions.map((position) => rotate(position, rotation)),
  );
  const relativePositions = rotations.map((roatation) =>
    roatation.map((coords) => translate(coords, { q: hex.q, r: hex.r })),
  );
  const traversers = relativePositions.map((positions) =>
    fromCoordinates(...positions),
  );

  const matches = traversers.map((traverser) => {
    const trav = grid.traverse(traverser, { bail: false }).toArray();
    // TODO: Make me dynamic
    // if (trav.length !== 4) return false;

    return trav.reduce((isMatch, hex, index) => {
      const place = playerBoard[hex.toString()];
      if (!place) return false;
      const placeTokens = place.tokens;
      const topPlaceToken = placeTokens.at(-1);
      if (!topPlaceToken) return false;
      const topToken = animalCard.shape[index]!.topToken;
      const stackMatch =
        placeTokens.length - 1 === topToken.index &&
        topPlaceToken.color === topToken.color;
      return isMatch && stackMatch;
    }, true);
  });
  return matches.some((match) => match);
}
