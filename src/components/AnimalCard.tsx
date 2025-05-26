import { animalCardImages } from "src/constants/animalCardImages";
import { AnimalCardId } from "src/sharedTypes";

interface AnimalCardProps {
  animalCardId: AnimalCardId;
}
export function AnimalCard({ animalCardId }: AnimalCardProps) {
  return <img src={animalCardImages[animalCardId]} alt={animalCardId} />;
}
