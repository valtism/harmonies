import clsx from "clsx";
import { defineHex, Grid, Orientation } from "honeycomb-grid";
import PartySocket from "partysocket";
import {
  startTransition,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";
import BoardSideA from "src/assets/boardSideA.webp";
import TokenBlue from "src/assets/tokenBlue.webp";
import { CentralBoard } from "src/components/CentralBoard";
import { PlayerBoard } from "src/components/Playerboard";
import { User } from "src/routes/$roomId";
import { ActionType, Color, PublicGameState, PublicToken } from "src/shared";

const defaultWidth = 726;

interface GameProps {
  gameState: PublicGameState;
  socket: PartySocket;
  // roomId: string;
  user: User;
}
export function Game({ gameState, socket, user }: GameProps) {
  console.log(gameState);

  const [width, setWidth] = useState(defaultWidth);

  function sendAction(action: ActionType) {
    socket.send(JSON.stringify(action));
  }

  const Hex = defineHex({
    dimensions: width / 14,
    orientation: Orientation.FLAT,
    origin: "topLeft",
  });

  // const coordinates: TupleCoordinates[] = jsonGrid.coordinates.map(
  //   ({ q, r }) => [q, r]
  // );

  const grid = new Grid(Hex, gameState.grid);

  const [token, setToken] = useState<PublicToken | null>(null);

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

  const [here, setHere] = useState(false);

  return (
    <div className="mb-60">
      <CentralBoard
        state={gameState.centralBoard}
        onClick={() => startTransition(() => setHere(true))}
      />
      <div></div>
      <PlayerBoard
        gameState={gameState}
        socket={socket}
        token={token}
        user={user}
      />

      <div
        className="size-20 bg-stone-400"
        onClick={() => startTransition(() => setHere(false))}
      >
        <ViewTransition name="hello">
          {here && <img src={TokenBlue} alt="token blue" width={30} />}
        </ViewTransition>
      </div>
      <div className="flex">
        {Object.values(Color).map((color) => (
          <button
            key={color}
            // onClick={() => setToken(color)}
            className="border border-gray-400 rounded px-4 py-2 text-white hover:bg-gray-600"
          >
            {color}
          </button>
        ))}
        <button
          key={token?.id}
          onClick={() => setToken(null)}
          className="border border-gray-400 rounded px-4 py-2 text-white hover:bg-gray-600"
        >
          null
        </button>
      </div>
      <div className="flex gap-1">
        <div className="text-white font-bold">Current Token: </div>
        {/* <div>{token}</div> */}
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
        {gameState.playerList.map((player) => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
      <button
        className="bg-stone-100 hover:bg-stone-300 text-stone-900 px-2 py-1 rounded"
        onClick={() => {
          sendAction({
            type: "startGame",
          });
        }}
      >
        Start Game
      </button>
    </div>
  );
}
