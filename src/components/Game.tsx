import PartySocket from "partysocket";
import { useState } from "react";
import { CentralBoard } from "src/components/CentralBoard";
import { PlayerBoard } from "src/components/PlayerBoard";
import { User } from "src/routes/$roomId";
import { ActionType, PublicGameState, Token } from "src/shared";

interface GameProps {
  gameState: PublicGameState;
  socket: PartySocket;
  // roomId: string;
  user: User;
}
export function Game({ gameState, socket, user }: GameProps) {
  console.log(gameState);

  function sendAction(action: ActionType) {
    socket.send(JSON.stringify(action));
  }

  const [token, setToken] = useState<Token | null>(null);

  return (
    <div className="mb-60">
      <CentralBoard
        state={gameState.centralBoard}
        onClick={(zone) => {
          console.log(zone);
        }}
      />
      <div></div>
      <PlayerBoard
        gameState={gameState}
        socket={socket}
        token={token}
        user={user}
      />

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
