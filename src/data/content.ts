import type { GridSize } from '../types/puzzle';

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  rare: boolean;
}

export interface Achievement {
  id: string;
  emoji: string;
  name: string;
  description: string;
  threshold: number;
}

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
}

export interface Accessory {
  id: string;
  emoji: string;
  name: string;
  starCost: number;
}

export interface PuzzlePackImage {
  id: string;
  name: string;
  path: string;
  width: number;
  height: number;
  fact: string;
}

export interface PuzzlePack {
  id: string;
  name: string;
  emoji: string;
  images: PuzzlePackImage[];
}

export const STICKERS: Sticker[] = [
  { id: 'puppy', emoji: '🐶', name: 'Puppy', rare: false },
  { id: 'lion', emoji: '🦁', name: 'Lion', rare: false },
  { id: 'fish', emoji: '🐠', name: 'Fish', rare: false },
  { id: 'star', emoji: '⭐', name: 'Star', rare: false },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn', rare: true },
  { id: 'rocket', emoji: '🚀', name: 'Rocket', rare: true },
  { id: 'dinosaur', emoji: '🦖', name: 'Dinosaur', rare: true },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', rare: true },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-puzzle', emoji: '🎯', name: 'First Puzzle', description: 'Complete your first puzzle!', threshold: 1 },
  { id: 'five-puzzles', emoji: '🖐️', name: '5 Puzzles', description: 'Complete 5 puzzles!', threshold: 5 },
  { id: 'ten-puzzles', emoji: '🔟', name: '10 Puzzles', description: 'Complete 10 puzzles!', threshold: 10 },
  { id: 'twenty-five-puzzles', emoji: '🏅', name: '25 Puzzles', description: 'Complete 25 puzzles!', threshold: 25 },
  { id: 'fifty-puzzles', emoji: '👑', name: '50 Puzzles', description: 'Complete 50 puzzles!', threshold: 50 },
  { id: 'puzzle-master', emoji: '🏆', name: 'Puzzle Master', description: 'Collect all stickers!', threshold: -1 },
];

export const AVATARS: Avatar[] = [
  { id: 'leo', emoji: '🦁', name: 'Leo' },
  { id: 'panda', emoji: '🐼', name: 'Panda' },
  { id: 'foxy', emoji: '🦊', name: 'Foxy' },
  { id: 'pingu', emoji: '🐧', name: 'Pingu' },
  { id: 'froggy', emoji: '🐸', name: 'Froggy' },
  { id: 'teddy', emoji: '🐻', name: 'Teddy' },
];

export const ACCESSORIES: Accessory[] = [
  { id: 'hat', emoji: '🎩', name: 'Hat', starCost: 10 },
  { id: 'glasses', emoji: '👓', name: 'Glasses', starCost: 15 },
  { id: 'crown', emoji: '👑', name: 'Crown', starCost: 25 },
  { id: 'cape', emoji: '🦸', name: 'Cape', starCost: 40 },
];

export const STAR_REWARDS: Record<GridSize, number> = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

export const DIFFICULTY_LABELS: Record<GridSize, { emoji: string; label: string }> = {
  2: { emoji: '🐣', label: 'Easy' },
  3: { emoji: '🐻', label: 'Medium' },
  4: { emoji: '🦁', label: 'Hard' },
  5: { emoji: '🚀', label: 'Expert' },
  6: { emoji: '🌟', label: 'Master' },
};

export const PUZZLE_PACKS: PuzzlePack[] = [
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🐾',
    images: [
      { id: 'puppy-pack', name: 'Puppy', path: '/packs/animals/puppy.svg', width: 400, height: 400, fact: 'Puppies love to play and learn new tricks!' },
      { id: 'cat-pack', name: 'Kitty', path: '/packs/animals/cat.svg', width: 400, height: 400, fact: 'Cats can sleep up to 16 hours a day!' },
      { id: 'bunny-pack', name: 'Bunny', path: '/packs/animals/bunny.svg', width: 400, height: 400, fact: 'Bunnies hop to move quickly and stay safe!' },
    ],
  },
  {
    id: 'dinosaurs',
    name: 'Dinosaurs',
    emoji: '🦕',
    images: [
      { id: 'trex-pack', name: 'T-Rex', path: '/packs/dinosaurs/trex.svg', width: 400, height: 400, fact: 'Tyrannosaurus Rex had powerful legs for running!' },
      { id: 'stego-pack', name: 'Stego', path: '/packs/dinosaurs/stego.svg', width: 400, height: 400, fact: 'Stegosaurus had plates on its back to stay cool!' },
      { id: 'dino-pack', name: 'Dino', path: '/packs/dinosaurs/dino.svg', width: 400, height: 400, fact: 'Some dinosaurs ate plants and some ate meat!' },
    ],
  },
  {
    id: 'space',
    name: 'Space',
    emoji: '🚀',
    images: [
      { id: 'rocket-pack', name: 'Rocket', path: '/packs/space/rocket.svg', width: 400, height: 400, fact: 'Rockets can travel faster than airplanes!' },
      { id: 'planet-pack', name: 'Planet', path: '/packs/space/planet.svg', width: 400, height: 400, fact: 'Jupiter is the biggest planet in our solar system!' },
      { id: 'astronaut-pack', name: 'Astronaut', path: '/packs/space/astronaut.svg', width: 400, height: 400, fact: 'Astronauts float in space because there is less gravity!' },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    images: [
      { id: 'whale-pack', name: 'Whale', path: '/packs/ocean/whale.svg', width: 400, height: 400, fact: 'Blue whales are the largest animals on Earth!' },
      { id: 'fish-pack', name: 'Fish', path: '/packs/ocean/fish.svg', width: 400, height: 400, fact: 'Fish breathe underwater using special organs called gills!' },
      { id: 'octopus-pack', name: 'Octopus', path: '/packs/ocean/octopus.svg', width: 400, height: 400, fact: 'Octopuses have eight arms and are very smart!' },
    ],
  },
  {
    id: 'cars',
    name: 'Cars',
    emoji: '🚗',
    images: [
      { id: 'racecar-pack', name: 'Race Car', path: '/packs/cars/racecar.svg', width: 400, height: 400, fact: 'Race cars are built to go very fast on special tracks!' },
      { id: 'truck-pack', name: 'Truck', path: '/packs/cars/truck.svg', width: 400, height: 400, fact: 'Big trucks carry heavy things to help people!' },
      { id: 'bus-pack', name: 'Bus', path: '/packs/cars/bus.svg', width: 400, height: 400, fact: 'School buses take children safely to school!' },
    ],
  },
];

export function getStickerById(id: string): Sticker | undefined {
  return STICKERS.find((s) => s.id === id);
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id);
}

export function getAccessoryById(id: string): Accessory | undefined {
  return ACCESSORIES.find((a) => a.id === id);
}

export function getFunFactForImageId(imageId: string): { title: string; fact: string } | null {
  for (const pack of PUZZLE_PACKS) {
    const img = pack.images.find((i) => i.id === imageId);
    if (img) return { title: img.name, fact: img.fact };
  }
  return null;
}

export function getPackImageById(imageId: string): PuzzlePackImage | undefined {
  for (const pack of PUZZLE_PACKS) {
    const img = pack.images.find((i) => i.id === imageId);
    if (img) return img;
  }
  return undefined;
}
