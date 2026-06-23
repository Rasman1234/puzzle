import { STICKERS } from '../data/content';
import { loadProgress, saveProgress } from './playerProgress';

export interface MysteryReward {
  type: 'stars' | 'sticker' | 'accessory' | 'rare_sticker' | 'bonus_stars';
  amount?: number;
  stickerId?: string;
  accessoryId?: string;
  label: string;
  emoji: string;
}

const REWARD_POOL: { weight: number; build: () => MysteryReward }[] = [
  { weight: 35, build: () => ({ type: 'stars', amount: 3, label: '3 Stars!', emoji: '⭐' }) },
  { weight: 25, build: () => ({ type: 'bonus_stars', amount: 5, label: 'Bonus 5 Stars!', emoji: '🌟' }) },
  { weight: 20, build: () => {
    const common = STICKERS.filter((s) => !s.rare);
    const s = common[Math.floor(Math.random() * common.length)];
    return { type: 'sticker', stickerId: s.id, label: `${s.name} Sticker!`, emoji: s.emoji };
  }},
  { weight: 12, build: () => ({ type: 'accessory', accessoryId: 'hat', label: 'Hat Unlock!', emoji: '🎩' }) },
  { weight: 8, build: () => {
    const rare = STICKERS.filter((s) => s.rare);
    const s = rare[Math.floor(Math.random() * rare.length)];
    return { type: 'rare_sticker', stickerId: s.id, label: `Rare ${s.name}!`, emoji: s.emoji };
  }},
];

export function openMysteryBox(): MysteryReward {
  const total = REWARD_POOL.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  let reward = REWARD_POOL[0].build();
  for (const entry of REWARD_POOL) {
    roll -= entry.weight;
    if (roll <= 0) {
      reward = entry.build();
      break;
    }
  }
  applyMysteryReward(reward);
  return reward;
}

export function applyMysteryReward(reward: MysteryReward): void {
  const p = loadProgress();
  switch (reward.type) {
    case 'stars':
    case 'bonus_stars':
      p.totalStars += reward.amount ?? 0;
      break;
    case 'sticker':
    case 'rare_sticker':
      if (reward.stickerId && !p.stickersCollected.includes(reward.stickerId)) {
        p.stickersCollected.push(reward.stickerId);
      }
      break;
    case 'accessory':
      if (reward.accessoryId && !p.unlockedAccessories.includes(reward.accessoryId)) {
        p.unlockedAccessories.push(reward.accessoryId);
      }
      break;
  }
  saveProgress(p);
}
