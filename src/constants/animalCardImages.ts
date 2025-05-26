import alligatorCard from "src/assets/animalCards/alligator.webp";
import alpacaCard from "src/assets/animalCards/alpaca.webp";
import arcticFoxCard from "src/assets/animalCards/arctic_fox.webp";
import batCard from "src/assets/animalCards/bat.webp";
import bearCard from "src/assets/animalCards/bear.webp";
import beeCard from "src/assets/animalCards/bee.webp";
import boarCard from "src/assets/animalCards/boar.webp";
import crowCard from "src/assets/animalCards/crow.webp";
import duckCard from "src/assets/animalCards/duck.webp";
import falconCard from "src/assets/animalCards/falcon.webp";
import fennicFoxCard from "src/assets/animalCards/fennic_fox.webp";
import fishCard from "src/assets/animalCards/fish.webp";
import flamingoCard from "src/assets/animalCards/flamingo.webp";
import frogCard from "src/assets/animalCards/frog.webp";
import headgehogCard from "src/assets/animalCards/headgehog.webp";
import kingfisherCard from "src/assets/animalCards/kingfisher.webp";
import koalaCard from "src/assets/animalCards/koala.webp";
import ladybugCard from "src/assets/animalCards/ladybug.webp";
import lizardCard from "src/assets/animalCards/lizard.webp";
import macaqueCard from "src/assets/animalCards/macaque.webp";
import macawCard from "src/assets/animalCards/macaw.webp";
import meerkatCard from "src/assets/animalCards/meerkat.webp";
import otterCard from "src/assets/animalCards/otter.webp";
import pantherCard from "src/assets/animalCards/panther.webp";
import peacockCard from "src/assets/animalCards/peacock.webp";
import penguinCard from "src/assets/animalCards/penguin.webp";
import rabbitCard from "src/assets/animalCards/rabbit.webp";
import raccoonCard from "src/assets/animalCards/raccoon.webp";
import rayCard from "src/assets/animalCards/ray.webp";
import shrewCard from "src/assets/animalCards/shrew.webp";
import squirrelCard from "src/assets/animalCards/squirrel.webp";
import wolfCard from "src/assets/animalCards/wolf.webp";
import { AnimalCardId } from "src/sharedTypes";

export const animalCardImages = {
  alligator: alligatorCard,
  alpaca: alpacaCard,
  arctic_fox: arcticFoxCard,
  bat: batCard,
  bear: bearCard,
  bee: beeCard,
  boar: boarCard,
  crow: crowCard,
  duck: duckCard,
  falcon: falconCard,
  fennic_fox: fennicFoxCard,
  fish: fishCard,
  flamingo: flamingoCard,
  frog: frogCard,
  headgehog: headgehogCard,
  kingfisher: kingfisherCard,
  koala: koalaCard,
  ladybug: ladybugCard,
  lizard: lizardCard,
  macaque: macaqueCard,
  macaw: macawCard,
  meerkat: meerkatCard,
  otter: otterCard,
  panther: pantherCard,
  peacock: peacockCard,
  penguin: penguinCard,
  rabbit: rabbitCard,
  raccoon: raccoonCard,
  ray: rayCard,
  shrew: shrewCard,
  squirrel: squirrelCard,
  wolf: wolfCard,
} as const satisfies Record<string, string>;
