import usePartySocket from "partysocket/react";
import { Game } from "./Game";
import { useState } from "react";
import { PublicGameState, publicGameStateSchema, User } from "src/shared";

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
      console.log("onMessage");
      console.log(evt);
      try {
        const gameState = publicGameStateSchema.parse(JSON.parse(evt.data));
        setGameState(gameState);
      } catch (error) {
        console.error(error);
      }
    },
  });

  if (!gameState) return null;

  return <Game gameState={gameState} socket={socket} user={user} />;
}
