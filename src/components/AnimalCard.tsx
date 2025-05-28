import { animalCardImages } from "src/constants/animalCardImages";
import { DerivedPublicGameState } from "src/sharedTypes";

interface AnimalCardProps {
  card: DerivedPublicGameState["players"][number]["animalCards"][number];
}
export function AnimalCard({ card }: AnimalCardProps) {
  if (!card) return null;
  return <img src={animalCardImages[card.id]} alt={card.id} />;
}
