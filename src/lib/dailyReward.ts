import { STICKERS } from '../data/content';
import { loadProgress, saveProgress } from './playerProgress';

export interface DailyRewardResult {
  type: 'stars' | 'sticker' | 'surprise';
  starsEarned: number;
  stickerEmoji?: string;
  message: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isDailyRewardAvailable(): boolean {
  const p = loadProgress();
  return p.lastDailyRewardDate !== todayKey();
}

export function claimDailyReward(): DailyRewardResult {
  const p = loadProgress();
  const today = todayKey();

  if (p.lastDailyRewardDate === today) {
    return { type: 'surprise', starsEarned: 0, message: 'Already claimed today!' };
  }

  p.lastDailyRewardDate = today;
  const roll = p.puzzlesCompleted % 3;

  let result: DailyRewardResult;

  if (roll === 0) {
    p.totalStars += 5;
    result = { type: 'stars', starsEarned: 5, message: 'You earned 5 bonus stars!' };
  } else if (roll === 1) {
    const sticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
    if (!p.stickersCollected.includes(sticker.id)) {
      p.stickersCollected.push(sticker.id);
    }
    result = {
      type: 'sticker',
      starsEarned: 0,
      stickerEmoji: sticker.emoji,
      message: `Daily sticker: ${sticker.name}!`,
    };
  } else {
    p.totalStars += 3;
    result = { type: 'surprise', starsEarned: 3, message: 'Surprise! 3 bonus stars!' };
  }

  saveProgress(p);
  return result;
}
