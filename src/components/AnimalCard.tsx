import { unstable_ViewTransition as ViewTransition } from "react";
import { animalCardImages } from "src/constants/animalCardImages";
import { DerivedPublicGameState } from "src/sharedTypes";

interface AnimalCardProps extends React.ComponentProps<"img"> {
  card: DerivedPublicGameState["players"][number]["animalCards"][number];
}
export function AnimalCard({ card, ...props }: AnimalCardProps) {
  if (!card) return null;
  return (
    <ViewTransition name={card.id}>
      <img src={animalCardImages[card.id]} alt={card.id} {...props} />
    </ViewTransition>
  );
}
