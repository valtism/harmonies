import usePartySocket from "partysocket/react";
import { Game, User } from "./Game";
import { useState } from "react";

const Token = {
  Blue: "blue",
  Gray: "gray",
  Brown: "brown",
  Green: "green",
  Yellow: "yellow",
  Red: "red",
} as const;
type Token = (typeof Token)[keyof typeof Token];
const Cubes = {
  Animal: "animal",
  Spirit: "spirit",
} as const;
type Cube = (typeof Cubes)[keyof typeof Cubes];
type CentralBoard = {
  0: Token[];
  1: Token[];
  2: Token[];
  3: Token[];
  4: Token[];
};
interface Tile {
  tokens: Token[];
  cube: Cube | null;
}

export interface GameState {
  players: User[];
  currentPlayer: string | null;
  board: "A" | "B";
  bag: Token[];
  centralBoard: CentralBoard;
  playerBoards: Record<string, Record<string, Tile>>;
}

interface GameSocketProps {
  roomId: string;
  user: User;
}
export function GameSocket({ roomId, user }: GameSocketProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    // host defaults to the current URL if not set
    //host: process.env.PARTYKIT_HOST,
    // we could use any room name here
    host: "localhost:1999",
    room: roomId,
    query: () => ({
      user: JSON.stringify(user),
    }),
    onMessage(evt) {
      console.log("onMessage");
      console.log(evt);
      setGameState(JSON.parse(evt.data));
    },
  });

  console.log({ gameState });

  if (!gameState) return null;

  return <Game gameState={gameState} socket={socket} user={user} />;
}
