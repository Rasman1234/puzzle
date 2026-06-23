import { AVATAR_LEVEL_XP, XP_PUZZLE, XP_ACHIEVEMENT, XP_WEEKLY_CHALLENGE, LEVEL_ACCESSORY_UNLOCKS } from '../data/v4Content';
import { loadProgress, saveProgress } from './playerProgress';

export function getAvatarLevel(xp: number): number {
  let level = 1;
  for (let i = AVATAR_LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= AVATAR_LEVEL_XP[i]) {
      level = i + 1;
      break;
    }
  }
  return Math.min(level, AVATAR_LEVEL_XP.length);
}

export function getXpForNextLevel(xp: number): { current: number; needed: number; level: number } {
  const level = getAvatarLevel(xp);
  const currentThreshold = AVATAR_LEVEL_XP[level - 1] ?? 0;
  const nextThreshold = AVATAR_LEVEL_XP[level] ?? AVATAR_LEVEL_XP[AVATAR_LEVEL_XP.length - 1];
  return {
    current: xp - currentThreshold,
    needed: nextThreshold - currentThreshold,
    level,
  };
}

export function addAvatarXP(amount: number): {
  xpEarned: number;
  leveledUp: boolean;
  newLevel: number;
} {
  const p = loadProgress();
  const oldLevel = getAvatarLevel(p.avatarXP);
  p.avatarXP += amount;
  const newLevel = getAvatarLevel(p.avatarXP);

  if (newLevel > oldLevel) {
    for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
      const accessoryId = LEVEL_ACCESSORY_UNLOCKS[lvl];
      if (accessoryId && !p.unlockedAccessories.includes(accessoryId)) {
        p.unlockedAccessories.push(accessoryId);
      }
    }
  }

  saveProgress(p);
  return { xpEarned: amount, leveledUp: newLevel > oldLevel, newLevel };
}

export function xpForPuzzleComplete(): number {
  return XP_PUZZLE;
}

export function xpForAchievement(): number {
  return XP_ACHIEVEMENT;
}

export function xpForWeeklyChallenge(): number {
  return XP_WEEKLY_CHALLENGE;
}
