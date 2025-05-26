import { AnimalCardId, BaseAnimalCard } from "src/sharedTypes";

export const animalCards = {
  alligator: {
    id: "alligator",
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
    id: "alpaca",
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
    id: "arctic_fox",
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
    id: "bat",
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
    id: "bear",
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
    id: "bee",
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
    id: "boar",
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
    id: "crow",
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
    id: "duck",
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
    id: "falcon",
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
    id: "fennic_fox",
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
    id: "fish",
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
    id: "flamingo",
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
    id: "frog",
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
    id: "headgehog",
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
    id: "kingfisher",
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
    id: "koala",
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
    id: "ladybug",
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
    id: "lizard",
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
    id: "macaque",
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
    id: "macaw",
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
    id: "meerkat",
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
    id: "otter",
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
    id: "panther",
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
    id: "peacock",
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
    id: "penguin",
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
    id: "rabbit",
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
    id: "raccoon",
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
    id: "ray",
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
    id: "shrew",
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
    id: "squirrel",
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
    id: "wolf",
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
} as const satisfies Record<AnimalCardId, BaseAnimalCard>;
