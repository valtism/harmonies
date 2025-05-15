import PartySocket from "partysocket";
import { CentralBoard } from "src/components/CentralBoard";
import { PlacingToken } from "src/components/PlacingToken";
import { PlayerBoard } from "src/components/PlayerBoard";
import { User } from "src/routes/$roomId";
import { ActionType, PublicGameState } from "src/shared";

interface GameProps {
  gameState: PublicGameState;
  socket: PartySocket;
  user: User;
}
export function Game({ gameState, socket, user }: GameProps) {
  console.log(gameState);

  function sendAction(action: ActionType) {
    socket.send(JSON.stringify(action));
  }

  return (
    <div className="mb-60 flex flex-col items-start">
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
      <CentralBoard
        state={gameState.centralBoard}
        onClick={(zone) => {
          sendAction({
            type: "takeTokens",
            payload: zone,
          });
        }}
      />
      <div></div>
      <PlayerBoard gameState={gameState} sendAction={sendAction} user={user} />

      <div className="text-white">
        <div className="font-bold">Players:</div>
        {gameState.playerList.map((player) => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>

      <PlacingToken token={gameState.players[user.id]!.placing} />
    </div>
  );
}
