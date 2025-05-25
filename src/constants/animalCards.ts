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
import { AnimalCard } from "src/sharedTypes";

export const animalCards = {
  alligator: {
    imageSrc: alligatorCard,
    scores: [4, 9, 15],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "green", index: 2 },
      },
    ],
  },
  alpaca: {
    imageSrc: alpacaCard,
    scores: [5, 12],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "gray", index: 1 },
      },
    ],
  },
  arctic_fox: {
    imageSrc: arcticFoxCard,
    scores: [5, 12],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 1 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "green", index: 1 },
      },
    ],
  },
  bat: {
    imageSrc: batCard,
    scores: [3, 6, 10, 15],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "gray", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 2 },
      },
    ],
  },
  bear: {
    imageSrc: bearCard,
    scores: [5, 11],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "gray", index: 1 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "gray", index: 1 },
      },
    ],
  },
  bee: {
    imageSrc: beeCard,
    scores: [8, 18],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  boar: {
    imageSrc: boarCard,
    scores: [4, 8, 13],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "red", index: 1 },
      },
    ],
  },
  crow: {
    imageSrc: crowCard,
    scores: [4, 9],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "red", index: 1 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "red", index: 1 },
      },
    ],
  },
  duck: {
    imageSrc: duckCard,
    scores: [2, 4, 8, 13],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "red", index: 1 },
      },
    ],
  },
  falcon: {
    imageSrc: falconCard,
    scores: [5, 11],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "gray", index: 2 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  fennic_fox: {
    imageSrc: fennicFoxCard,
    scores: [4, 9, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "gray", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "gray", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  fish: {
    imageSrc: fishCard,
    scores: [3, 6, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "gray", index: 2 },
      },
    ],
  },
  flamingo: {
    imageSrc: flamingoCard,
    scores: [4, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  frog: {
    imageSrc: frogCard,
    scores: [2, 4, 6, 10, 15],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 0 },
      },
    ],
  },
  headgehog: {
    imageSrc: headgehogCard,
    scores: [5, 12],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "red", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 1 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "green", index: 1 },
      },
    ],
  },
  kingfisher: {
    imageSrc: kingfisherCard,
    scores: [5, 11, 18],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 2 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
    ],
  },
  koala: {
    imageSrc: koalaCard,
    scores: [3, 6, 10, 15],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 0 },
      },
    ],
  },
  ladybug: {
    imageSrc: ladybugCard,
    scores: [2, 5, 8, 12, 17],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 0 },
      },
    ],
  },
  lizard: {
    imageSrc: lizardCard,
    scores: [5, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "red", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  macaque: {
    imageSrc: macaqueCard,
    scores: [5, 11],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "gray", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
    ],
  },
  macaw: {
    imageSrc: macawCard,
    scores: [4, 9, 14],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
    ],
  },
  meerkat: {
    imageSrc: meerkatCard,
    scores: [2, 5, 9, 14],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "gray", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  otter: {
    imageSrc: otterCard,
    scores: [5, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "green", index: 0 },
      },
    ],
  },
  panther: {
    imageSrc: pantherCard,
    scores: [5, 11],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "green", index: 0 },
      },
    ],
  },
  peacock: {
    imageSrc: peacockCard,
    scores: [5, 10, 17],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "red", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
    ],
  },
  penguin: {
    imageSrc: penguinCard,
    scores: [4, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "gray", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
    ],
  },
  rabbit: {
    imageSrc: rabbitCard,
    scores: [5, 10, 17],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 0 },
      },
      {
        coordinates: { q: 2, r: 0 },
        topToken: { color: "red", index: 1 },
      },
    ],
  },
  raccoon: {
    imageSrc: raccoonCard,
    scores: [6, 12],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "blue", index: 0 },
      },
    ],
  },
  ray: {
    imageSrc: rayCard,
    scores: [4, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "blue", index: 0 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "gray", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "gray", index: 0 },
      },
    ],
  },
  shrew: {
    imageSrc: shrewCard,
    scores: [5, 10, 17],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "red", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: -1, r: 1 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
  squirrel: {
    imageSrc: squirrelCard,
    scores: [4.9, 15],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "red", index: 1 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "green", index: 2 },
      },
    ],
  },
  wolf: {
    imageSrc: wolfCard,
    scores: [4, 10, 16],
    shape: [
      {
        coordinates: { q: 0, r: 0 },
        topToken: { color: "green", index: 2 },
      },
      {
        coordinates: { q: 1, r: 0 },
        topToken: { color: "yellow", index: 0 },
      },
      {
        coordinates: { q: 0, r: 1 },
        topToken: { color: "yellow", index: 0 },
      },
    ],
  },
} as const satisfies Record<string, AnimalCard>;
