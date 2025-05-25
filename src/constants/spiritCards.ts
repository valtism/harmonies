import butterflySpiritCard from "src/assets/spiritCards/butterfly_spirit.webp";
import catSpiritCard from "src/assets/spiritCards/cat_spirit.webp";
import craneSpiritCard from "src/assets/spiritCards/crane_spirit.webp";
import deerSpiritCard from "src/assets/spiritCards/deer_spirit.webp";
import dragonflySpiritCard from "src/assets/spiritCards/dragonfly_spirit.webp";
import lionSpiritCard from "src/assets/spiritCards/lion_spirit.webp";
import marmotSpiritCard from "src/assets/spiritCards/marmot_spirit.webp";
import owlSpiritCard from "src/assets/spiritCards/owl_spirit.webp";
import ramSpiritCard from "src/assets/spiritCards/ram_spirit.webp";
import tortiseSpiritCard from "src/assets/spiritCards/tortise_spirit.webp";
import { SpiritCard } from "src/sharedTypes";

export const spiritCards = {
  butterflySpirit: {
    imageSrc: butterflySpiritCard,
  },
  catSpirit: {
    imageSrc: catSpiritCard,
  },
  craneSpirit: {
    imageSrc: craneSpiritCard,
  },
  deerSpirit: {
    imageSrc: deerSpiritCard,
  },
  dragonflySpirit: {
    imageSrc: dragonflySpiritCard,
  },
  lionSpirit: {
    imageSrc: lionSpiritCard,
  },
  marmotSpirit: {
    imageSrc: marmotSpiritCard,
  },
  owlSpirit: {
    imageSrc: owlSpiritCard,
  },
  ramSpirit: {
    imageSrc: ramSpiritCard,
  },
  tortiseSpirit: {
    imageSrc: tortiseSpiritCard,
  },
} as const satisfies Record<string, SpiritCard>;
