import usePartySocket from "partysocket/react";
import { useState } from "react";
import { PublicGameState, User } from "src/shared";
import { Game } from "./Game";

interface GameSocketProps {
  roomId: string;
  user: User;
}
export function GameSocket({ roomId, user }: GameSocketProps) {
  const [gameState, setGameState] = useState<PublicGameState | null>(null);

  const socket = usePartySocket({
    // host defaults to the current URL if not set
    // host: process.env.PARTYKIT_HOST,
    // we could use any room name here
    host: "localhost:1999",
    room: roomId,
    query: () => ({
      user: JSON.stringify(user),
    }),
    onMessage(evt) {
      const gameState = JSON.parse(evt.data) as PublicGameState;
      setGameState(gameState);
    },
  });

  if (!gameState) return null;

  return <Game gameState={gameState} socket={socket} user={user} />;
}
