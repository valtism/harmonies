import { CentralBoard } from "src/components/CentralBoard";
import { PlayerBoard } from "src/components/PlayerBoard";
import { ActionType, DerivedPublicGameState } from "src/sharedTypes";

interface GameProps {
  gameState: DerivedPublicGameState;
  sendAction: (action: ActionType) => void;
  playerId: string;
}
export function Game({ gameState, sendAction, playerId }: GameProps) {
  console.log(gameState);

  return (
    <div className="mb-60 flex flex-col items-start">
      {gameState.currentPlayerId === playerId && (
        <div className="fixed top-2 right-4">Your turn!</div>
      )}
      <button
        className="rounded bg-stone-100 px-2 py-1 text-stone-900 hover:bg-stone-300"
        onClick={() => {
          sendAction({
            type: "undo",
          });
        }}
      >
        Undo
      </button>
      <button
        className="rounded bg-stone-100 px-2 py-1 text-stone-900 hover:bg-stone-300"
        onClick={() => {
          sendAction({
            type: "endTurn",
          });
        }}
      >
        End turn
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

      {Object.values(gameState.players).map((player) => (
        <div key={player.id} style={{ width: 400 }}>
          <PlayerBoard
            playerId={player.id}
            gameState={gameState}
            sendAction={sendAction}
          />
        </div>
      ))}

      <div className="text-white">
        <div className="font-bold">Players:</div>
        {Object.values(gameState.players).map((player) => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
    </div>
  );
}
