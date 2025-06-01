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
        return (
          <button key={index}>
            <AnimalCard
              card={{
                ...card,
                scores: card.scores.map((score) => ({
                  points: score,
                  cubeId: null,
                })),
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
