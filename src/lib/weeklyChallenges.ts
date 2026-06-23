import type { GridSize } from '../types/puzzle';
import { loadProgress, saveProgress } from './playerProgress';
import { addAvatarXP, xpForWeeklyChallenge } from './avatarLevels';

export interface WeeklyChallenge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  target: number;
  type: 'puzzles' | 'category' | 'stars' | 'hard';
  categoryId?: string;
  rewardStars: number;
  rewardLabel: string;
}

export function getWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${week}`;
}

function seededPick<T>(arr: T[], seed: number, count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  let s = seed;
  while (result.length < count && copy.length > 0) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idx = s % copy.length;
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

export function generateWeeklyChallenges(weekKey: string): WeeklyChallenge[] {
  const seed = weekKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const templates: WeeklyChallenge[] = [
    { id: 'w-puzzles', emoji: '🧩', title: 'Puzzle Pal', description: 'Complete 5 puzzles this week', target: 5, type: 'puzzles', rewardStars: 10, rewardLabel: '10 bonus stars' },
    { id: 'w-dino', emoji: '🦖', title: 'Dino Fan', description: 'Complete 3 dinosaur puzzles', target: 3, type: 'category', categoryId: 'dinosaurs', rewardStars: 8, rewardLabel: 'Special dino sticker' },
    { id: 'w-stars', emoji: '⭐', title: 'Star Hunter', description: 'Earn 20 stars this week', target: 20, type: 'stars', rewardStars: 5, rewardLabel: '5 bonus stars' },
    { id: 'w-hard', emoji: '🦁', title: 'Brave Solver', description: 'Solve 2 hard+ puzzles', target: 2, type: 'hard', rewardStars: 12, rewardLabel: 'Rare sticker chance' },
    { id: 'w-ocean', emoji: '🌊', title: 'Ocean Explorer', description: 'Complete 3 ocean puzzles', target: 3, type: 'category', categoryId: 'ocean', rewardStars: 8, rewardLabel: 'Ocean collectible' },
    { id: 'w-space', emoji: '🚀', title: 'Space Cadet', description: 'Complete 3 space puzzles', target: 3, type: 'category', categoryId: 'space', rewardStars: 8, rewardLabel: 'Space collectible' },
  ];
  return seededPick(templates, seed, 3);
}

export function ensureWeeklyChallenges(): WeeklyChallenge[] {
  const p = loadProgress();
  const week = getWeekKey();
  if (p.weeklyWeekKey !== week) {
    p.weeklyWeekKey = week;
    p.weeklyChallengeIds = generateWeeklyChallenges(week).map((c) => c.id);
    p.weeklyStarsEarned = 0;
    p.weeklyPuzzles = 0;
    p.weeklyCategoryCounts = {};
    p.weeklyHardPuzzles = 0;
    p.weeklyChallengesClaimed = [];
    saveProgress(p);
  }
  const ids = p.weeklyChallengeIds;
  const all = generateWeeklyChallenges(week);
  return all.filter((c) => ids.includes(c.id));
}

export function getWeeklyChallengeProgress(challenge: WeeklyChallenge): number {
  const p = loadProgress();
  switch (challenge.type) {
    case 'puzzles':
      return p.weeklyPuzzles;
    case 'stars':
      return p.weeklyStarsEarned;
    case 'hard':
      return p.weeklyHardPuzzles;
    case 'category':
      return p.weeklyCategoryCounts[challenge.categoryId ?? ''] ?? 0;
    default:
      return 0;
  }
}

export function isWeeklyChallengeComplete(challenge: WeeklyChallenge): boolean {
  return getWeeklyChallengeProgress(challenge) >= challenge.target;
}

export function claimWeeklyChallenge(challengeId: string): boolean {
  const p = loadProgress();
  if (p.weeklyChallengesClaimed.includes(challengeId)) return false;
  const challenge = ensureWeeklyChallenges().find((c) => c.id === challengeId);
  if (!challenge || !isWeeklyChallengeComplete(challenge)) return false;

  p.weeklyChallengesClaimed.push(challengeId);
  p.totalStars += challenge.rewardStars;
  if (challenge.id === 'w-dino' && !p.stickersCollected.includes('dinosaur')) {
    p.stickersCollected.push('dinosaur');
  }
  saveProgress(p);
  addAvatarXP(xpForWeeklyChallenge());
  return true;
}

export function updateWeeklyStats(params: {
  gridSize: GridSize;
  starsEarned: number;
  categoryId?: string;
}): void {
  const p = loadProgress();
  const week = getWeekKey();
  if (p.weeklyWeekKey !== week) {
    ensureWeeklyChallenges();
    return updateWeeklyStats(params);
  }
  p.weeklyPuzzles += 1;
  p.weeklyStarsEarned += params.starsEarned;
  if (params.categoryId) {
    p.weeklyCategoryCounts[params.categoryId] =
      (p.weeklyCategoryCounts[params.categoryId] ?? 0) + 1;
  }
  if (params.gridSize >= 4) {
    p.weeklyHardPuzzles += 1;
  }
  saveProgress(p);
}
