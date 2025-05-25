import { animalCards } from "src/constants/animalCards";
import { AnimalCardId } from "src/sharedTypes";

interface AnimalCardProps {
  animalCardId: AnimalCardId;
}
export function AnimalCard({ animalCardId }: AnimalCardProps) {
  const animalCard = animalCards[animalCardId];

  return <img src={animalCard.imageSrc} alt={animalCardId} />;
}
