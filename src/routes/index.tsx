import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

// 6 character hex code
const randomRoomId = Math.floor(Math.random() * 16777215).toString(16);

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [name, setName] = useState(randomRoomId);

  return (
    <div className="p-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        className="bg-stone-600 rounded"
      />
      <Link to="/$roomId" params={{ roomId: randomRoomId }}>
        Create a game
      </Link>
    </div>
  );
}
