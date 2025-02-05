import { createFileRoute } from "@tanstack/react-router";
import { Game } from "src/components/Game";

export const Route = createFileRoute("/$roomId")({
  component: Room,
});

function Room() {
  const { roomId } = Route.useParams();

  return (
    <div>
      <div>Hello from {roomId}!</div>
      <Game />
    </div>
  );
}
