import { CentralBoard } from "src/components/CentralBoard";
import { PlayerBoard } from "src/components/PlayerBoard";
import { ActionType, DerivedPublicGameState } from "src/sharedTypes";

interface GameProps {
  gameState: DerivedPublicGameState;
  sendAction: (action: ActionType) => void;
}
export function Game({ gameState, sendAction }: GameProps) {
  console.log(gameState);

  return (
    <div className="mb-60 flex flex-col items-start">
      {/* <button
        className="rounded bg-stone-100 px-2 py-1 text-stone-900 hover:bg-stone-300"
        onClick={() => {
          sendAction({
            type: "startGame",
          });
        }}
      >
        Start
      </button> */}
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
      <PlayerBoard gameState={gameState} sendAction={sendAction} />

      <div className="text-white">
        <div className="font-bold">Players:</div>
        {/* {gameState.playerList.map((player) => (
          <div key={player.id}>{player.name}</div>
        ))} */}
      </div>
    </div>
  );
}
