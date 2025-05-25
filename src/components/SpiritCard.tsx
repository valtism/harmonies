import { spiritCards } from "src/constants/spiritCards";
import { SpiritCardId } from "src/sharedTypes";

interface SpiritCardProps {
  spiritCardId: SpiritCardId;
}
export function SpiritCard({ spiritCardId }: SpiritCardProps) {
  const spiritCard = spiritCards[spiritCardId];

  return <img src={spiritCard.imageSrc} alt={spiritCardId} />;
}
