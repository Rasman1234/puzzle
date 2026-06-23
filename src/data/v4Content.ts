import { PUZZLE_PACKS } from './content';

export interface CollectionItem {
  id: string;
  categoryId: string;
  name: string;
  emoji: string;
}

export interface EducationalQuiz {
  question: string;
  options: [string, string, string];
  correctIndex: number;
  encouragement: string;
}

export interface EducationalDiscovery {
  didYouKnow: string;
  quiz: EducationalQuiz;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  emoji: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  exclusiveStickerId: string;
  exclusiveAccessoryId: string;
  challengeLabel: string;
}

export const AVATAR_LEVEL_XP = [0, 50, 120, 200, 300];
export const XP_PUZZLE = 10;
export const XP_ACHIEVEMENT = 25;
export const XP_WEEKLY_CHALLENGE = 50;

export const LEVEL_ACCESSORY_UNLOCKS: Record<number, string> = {
  2: 'hat',
  3: 'glasses',
  4: 'cape',
  5: 'crown',
};

export const COLLECTION_CATEGORIES = [
  { id: 'animals', name: 'Animals', emoji: '🐾' },
  { id: 'dinosaurs', name: 'Dinosaurs', emoji: '🦕' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊' },
  { id: 'space', name: 'Space', emoji: '🚀' },
  { id: 'cars', name: 'Cars', emoji: '🚗' },
] as const;

function buildCollectionItems(): CollectionItem[] {
  const items: CollectionItem[] = [];
  const extras: Record<string, CollectionItem[]> = {
    animals: [
      { id: 'col-lion', categoryId: 'animals', name: 'Lion', emoji: '🦁' },
      { id: 'col-bird', categoryId: 'animals', name: 'Bird', emoji: '🐦' },
      { id: 'col-horse', categoryId: 'animals', name: 'Horse', emoji: '🐴' },
    ],
    dinosaurs: [
      { id: 'col-raptor', categoryId: 'dinosaurs', name: 'Raptor', emoji: '🦖' },
      { id: 'col-egg', categoryId: 'dinosaurs', name: 'Dino Egg', emoji: '🥚' },
    ],
    ocean: [
      { id: 'col-coral', categoryId: 'ocean', name: 'Coral', emoji: '🪸' },
      { id: 'col-shell', categoryId: 'ocean', name: 'Shell', emoji: '🐚' },
    ],
    space: [
      { id: 'col-moon', categoryId: 'space', name: 'Moon', emoji: '🌙' },
      { id: 'col-comet', categoryId: 'space', name: 'Comet', emoji: '☄️' },
    ],
    cars: [
      { id: 'col-taxi', categoryId: 'cars', name: 'Taxi', emoji: '🚕' },
      { id: 'col-train', categoryId: 'cars', name: 'Train', emoji: '🚂' },
    ],
  };

  for (const pack of PUZZLE_PACKS) {
    for (const img of pack.images) {
      items.push({
        id: `col-${img.id}`,
        categoryId: pack.id,
        name: img.name,
        emoji: pack.emoji,
      });
    }
    items.push(...(extras[pack.id] ?? []));
  }
  return items;
}

export const COLLECTION_ITEMS = buildCollectionItems();

export const EDUCATIONAL_DISCOVERY: Record<string, EducationalDiscovery> = {
  'puppy-pack': {
    didYouKnow: 'Dogs can learn over 100 words with practice!',
    quiz: {
      question: 'What sound does a dog make?',
      options: ['Woof', 'Moo', 'Meow'],
      correctIndex: 0,
      encouragement: 'Great try! Dogs say woof!',
    },
  },
  'cat-pack': {
    didYouKnow: 'Cats use their whiskers to feel in the dark!',
    quiz: {
      question: 'Where do pet cats like to nap?',
      options: ['Cozy spots', 'Underwater', 'In trees only'],
      correctIndex: 0,
      encouragement: 'Nice guess! Cats love cozy naps!',
    },
  },
  'bunny-pack': {
    didYouKnow: 'Bunnies can hop very fast to stay safe!',
    quiz: {
      question: 'What do bunnies love to eat?',
      options: ['Carrots', 'Rocks', 'Clouds'],
      correctIndex: 0,
      encouragement: 'Bunnies enjoy carrots and veggies!',
    },
  },
  'trex-pack': {
    didYouKnow: 'T-Rex had teeth as long as bananas!',
    quiz: {
      question: 'T-Rex was a…',
      options: ['Dinosaur', 'Fish', 'Butterfly'],
      correctIndex: 0,
      encouragement: 'Yes! T-Rex was a mighty dinosaur!',
    },
  },
  'stego-pack': {
    didYouKnow: 'Stegosaurus had a brain the size of a walnut!',
    quiz: {
      question: 'Stegosaurus had plates on its…',
      options: ['Back', 'Toes', 'Nose'],
      correctIndex: 0,
      encouragement: 'Those plates were on its back!',
    },
  },
  'dino-pack': {
    didYouKnow: 'Some dinosaurs were as small as chickens!',
    quiz: {
      question: 'Dinosaurs lived long…',
      options: ['Ago', 'Tomorrow', 'On the moon'],
      correctIndex: 0,
      encouragement: 'Dinosaurs lived long, long ago!',
    },
  },
  'rocket-pack': {
    didYouKnow: 'Rockets need huge engines to leave Earth!',
    quiz: {
      question: 'Rockets fly into…',
      options: ['Space', 'The ocean floor', 'Underground'],
      correctIndex: 0,
      encouragement: 'Rockets soar into space!',
    },
  },
  'planet-pack': {
    didYouKnow: 'Saturn has beautiful rings made of ice and rock!',
    quiz: {
      question: 'Earth is a…',
      options: ['Planet', 'Star', 'Comet'],
      correctIndex: 0,
      encouragement: 'Earth is our home planet!',
    },
  },
  'astronaut-pack': {
    didYouKnow: 'Astronauts exercise in space to stay strong!',
    quiz: {
      question: 'Astronauts travel in a…',
      options: ['Rocket', 'Submarine', 'Bicycle'],
      correctIndex: 0,
      encouragement: 'Astronauts ride rockets to space!',
    },
  },
  'whale-pack': {
    didYouKnow: 'Whales sing songs to communicate!',
    quiz: {
      question: 'Whales live in the…',
      options: ['Ocean', 'Desert', 'Sky'],
      correctIndex: 0,
      encouragement: 'Whales are amazing ocean animals!',
    },
  },
  'fish-pack': {
    didYouKnow: 'Some fish can change colors to hide!',
    quiz: {
      question: 'Fish breathe using…',
      options: ['Gills', 'Feathers', 'Wheels'],
      correctIndex: 0,
      encouragement: 'Fish use gills to breathe underwater!',
    },
  },
  'octopus-pack': {
    didYouKnow: 'Octopuses have three hearts!',
    quiz: {
      question: 'How many arms does an octopus have?',
      options: ['Eight', 'Two', 'One hundred'],
      correctIndex: 0,
      encouragement: 'Eight arms — great counting!',
    },
  },
  'racecar-pack': {
    didYouKnow: 'Race cars can go over 200 miles per hour!',
    quiz: {
      question: 'Race cars go very…',
      options: ['Fast', 'Slow', 'Backward only'],
      correctIndex: 0,
      encouragement: 'Race cars are built for speed!',
    },
  },
  'truck-pack': {
    didYouKnow: 'Trucks help deliver food and toys to stores!',
    quiz: {
      question: 'Trucks carry…',
      options: ['Heavy loads', 'Only feathers', 'Only water'],
      correctIndex: 0,
      encouragement: 'Trucks are strong helpers!',
    },
  },
  'bus-pack': {
    didYouKnow: 'Yellow buses are easy to see for safety!',
    quiz: {
      question: 'School buses take kids to…',
      options: ['School', 'The moon', 'Underwater'],
      correctIndex: 0,
      encouragement: 'Buses help kids get to school safely!',
    },
  },
};

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'summer-adventure',
    name: 'Summer Adventure',
    emoji: '☀️',
    startMonth: 6,
    startDay: 1,
    endMonth: 8,
    endDay: 31,
    exclusiveStickerId: 'summer-sun',
    exclusiveAccessoryId: 'summer-hat',
    challengeLabel: 'Complete 3 puzzles during Summer Adventure!',
  },
  {
    id: 'dinosaur-week',
    name: 'Dinosaur Week',
    emoji: '🦕',
    startMonth: 3,
    startDay: 15,
    endMonth: 3,
    endDay: 22,
    exclusiveStickerId: 'dino-egg',
    exclusiveAccessoryId: 'dino-badge',
    challengeLabel: 'Complete 2 dinosaur puzzles!',
  },
  {
    id: 'ocean-month',
    name: 'Ocean Discovery',
    emoji: '🌊',
    startMonth: 7,
    startDay: 1,
    endMonth: 7,
    endDay: 31,
    exclusiveStickerId: 'ocean-pearl',
    exclusiveAccessoryId: 'snorkel',
    challengeLabel: 'Complete 2 ocean puzzles!',
  },
  {
    id: 'space-event',
    name: 'Space Explorer',
    emoji: '🚀',
    startMonth: 4,
    startDay: 1,
    endMonth: 4,
    endDay: 14,
    exclusiveStickerId: 'space-star',
    exclusiveAccessoryId: 'space-helmet',
    challengeLabel: 'Complete 2 space puzzles!',
  },
];

export const EVENT_STICKERS: Record<string, { id: string; emoji: string; name: string }> = {
  'summer-sun': { id: 'summer-sun', emoji: '☀️', name: 'Summer Sun' },
  'dino-egg': { id: 'dino-egg', emoji: '🥚', name: 'Dino Egg' },
  'ocean-pearl': { id: 'ocean-pearl', emoji: '🔮', name: 'Ocean Pearl' },
  'space-star': { id: 'space-star', emoji: '✨', name: 'Space Star' },
};

export function getEducationalDiscovery(imageId: string): EducationalDiscovery | null {
  return EDUCATIONAL_DISCOVERY[imageId] ?? null;
}

export function getCollectionByCategory(categoryId: string): CollectionItem[] {
  return COLLECTION_ITEMS.filter((i) => i.categoryId === categoryId);
}
