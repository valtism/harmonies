import { AnimalCard } from "src/components/AnimalCard";
import { DerivedPublicGameState } from "src/sharedTypes";

interface AnimalCardSpreadProps {
  spread: DerivedPublicGameState["animalCardSpread"];
}

export function AnimalCardSpread({ spread }: AnimalCardSpreadProps) {
  return (
    <div className="flex h-60 gap-2">
      {spread.map((card, index) => {
        if (!card) return null;
        return <AnimalCard key={index} card={card} />;
      })}
    </div>
  );
}
