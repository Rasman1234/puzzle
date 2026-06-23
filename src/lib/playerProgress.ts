import type { GridSize } from '../types/puzzle';
import { STICKERS, ACHIEVEMENTS, STAR_REWARDS, ACCESSORIES, type Sticker, type Achievement } from '../data/content';
import { updateWeeklyStats } from './weeklyChallenges';
import { addAvatarXP, xpForPuzzleComplete, xpForAchievement, getAvatarLevel } from './avatarLevels';
import { COLLECTION_ITEMS } from '../data/v4Content';

const STORAGE_KEY = 'kids-puzzle-progress-v4';
const LEGACY_KEY_V3 = 'kids-puzzle-progress-v3';
const LEGACY_KEY_V2 = 'kids-puzzle-progress-v2';

export interface RecentPuzzleRecord {
  gridSize: GridSize;
  elapsedSeconds: number;
  hintsUsed: number;
  categoryId?: string;
}

export interface PlayerProgress {
  puzzlesCompleted: number;
  stickersCollected: string[];
  achievementsUnlocked: string[];
  totalHintsUsed: number;
  solveTimes: number[];
  difficultyCounts: Record<string, number>;
  fastestSolve: number | null;
  avatarId: string | null;
  equippedAccessories: string[];
  unlockedAccessories: string[];
  totalStars: number;
  soundEnabled: boolean;
  lastVisitDate: string | null;
  lastDailyRewardDate: string | null;
  categoryCounts: Record<string, number>;
  totalSessions: number;
  sessionDurations: number[];
  sessionStartTime: number | null;
  recentPuzzles: RecentPuzzleRecord[];
  avatarXP: number;
  weeklyWeekKey: string | null;
  weeklyChallengeIds: string[];
  weeklyPuzzles: number;
  weeklyStarsEarned: number;
  weeklyCategoryCounts: Record<string, number>;
  weeklyHardPuzzles: number;
  weeklyChallengesClaimed: string[];
  collectionUnlocked: string[];
  topicsExplored: string[];
  weeklyActivityLog: { week: string; puzzles: number }[];
  seasonalClaims: string[];
}

export interface VictoryResult {
  sticker: Sticker;
  isRare: boolean;
  isNewSticker: boolean;
  newAchievements: Achievement[];
  totalCompleted: number;
  starsEarned: number;
  xpEarned: number;
  avatarLevel: number;
  leveledUp: boolean;
  newCollectionItem?: string;
}

export interface ParentInsightsV2 {
  totalPuzzles: number;
  favoriteDifficulty: string;
  averageSolveTime: number;
  fastestSolve: number | null;
  totalHintsUsed: number;
  achievementProgress: { unlocked: number; total: number };
  stickersCollected: number;
  stickersTotal: number;
  totalStars: number;
  totalSessions: number;
  averageSessionDuration: number;
  favoriteCategory: string;
  puzzlesThisWeek: number;
  learningSummary: string;
}

export interface ParentInsightsV3 extends ParentInsightsV2 {
  avatarLevel: number;
  avatarXP: number;
  weeklyPuzzles: number;
  weeklyChallengesCompleted: number;
  topicsExplored: number;
  collectionPercent: number;
  difficultyProgression: string;
  learningSummaryV3: string;
}

function freshProgress(): PlayerProgress {
  return {
    puzzlesCompleted: 0,
    stickersCollected: [],
    achievementsUnlocked: [],
    totalHintsUsed: 0,
    solveTimes: [],
    difficultyCounts: {},
    fastestSolve: null,
    avatarId: null,
    equippedAccessories: [],
    unlockedAccessories: [],
    totalStars: 0,
    soundEnabled: false,
    lastVisitDate: null,
    lastDailyRewardDate: null,
    categoryCounts: {},
    totalSessions: 0,
    sessionDurations: [],
    sessionStartTime: null,
    recentPuzzles: [],
    avatarXP: 0,
    weeklyWeekKey: null,
    weeklyChallengeIds: [],
    weeklyPuzzles: 0,
    weeklyStarsEarned: 0,
    weeklyCategoryCounts: {},
    weeklyHardPuzzles: 0,
    weeklyChallengesClaimed: [],
    collectionUnlocked: [],
    topicsExplored: [],
    weeklyActivityLog: [],
    seasonalClaims: [],
  };
}

function migrateFromKey(key: string): PlayerProgress | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const migrated = { ...freshProgress(), ...parsed };
    saveProgress(migrated);
    localStorage.removeItem(key);
    return migrated;
  } catch {
    return null;
  }
}

function migrateLegacy(): PlayerProgress | null {
  return migrateFromKey(LEGACY_KEY_V3) ?? migrateFromKey(LEGACY_KEY_V2);
}

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = migrateLegacy();
      if (legacy) return legacy;
      return freshProgress();
    }
    const parsed = JSON.parse(raw) as PlayerProgress;
    return {
      ...freshProgress(),
      ...parsed,
      solveTimes: [...(parsed.solveTimes ?? [])],
      stickersCollected: [...(parsed.stickersCollected ?? [])],
      achievementsUnlocked: [...(parsed.achievementsUnlocked ?? [])],
      difficultyCounts: { ...(parsed.difficultyCounts ?? {}) },
      categoryCounts: { ...(parsed.categoryCounts ?? {}) },
      equippedAccessories: [...(parsed.equippedAccessories ?? [])],
      unlockedAccessories: [...(parsed.unlockedAccessories ?? [])],
      sessionDurations: [...(parsed.sessionDurations ?? [])],
      collectionUnlocked: [...(parsed.collectionUnlocked ?? [])],
      topicsExplored: [...(parsed.topicsExplored ?? [])],
      weeklyActivityLog: [...(parsed.weeklyActivityLog ?? [])],
      weeklyChallengeIds: [...(parsed.weeklyChallengeIds ?? [])],
      weeklyChallengesClaimed: [...(parsed.weeklyChallengesClaimed ?? [])],
      weeklyCategoryCounts: { ...(parsed.weeklyCategoryCounts ?? {}) },
      seasonalClaims: [...(parsed.seasonalClaims ?? [])],
    };
  } catch {
    return freshProgress();
  }
}

export function saveProgress(progress: PlayerProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function recordVisit(): void {
  const p = loadProgress();
  const today = todayKey();

  if (p.lastVisitDate !== today) {
    p.totalSessions += 1;
    p.lastVisitDate = today;
  }

  p.sessionStartTime = Date.now();
  saveProgress(p);
}

export function recordSessionEnd(): void {
  const p = loadProgress();
  if (p.sessionStartTime) {
    const duration = Math.round((Date.now() - p.sessionStartTime) / 1000);
    if (duration > 5) {
      p.sessionDurations.push(duration);
    }
    p.sessionStartTime = null;
    saveProgress(p);
  }
}

export function setAvatar(avatarId: string): void {
  const p = loadProgress();
  p.avatarId = avatarId;
  saveProgress(p);
}

export function unlockAccessory(accessoryId: string): boolean {
  const p = loadProgress();
  const accessory = ACCESSORIES.find((a) => a.id === accessoryId);
  if (!accessory || p.unlockedAccessories.includes(accessoryId)) return false;
  if (p.totalStars < accessory.starCost) return false;
  p.totalStars -= accessory.starCost;
  p.unlockedAccessories.push(accessoryId);
  saveProgress(p);
  return true;
}

export function toggleAccessory(accessoryId: string): void {
  const p = loadProgress();
  if (!p.unlockedAccessories.includes(accessoryId)) return;
  if (p.equippedAccessories.includes(accessoryId)) {
    p.equippedAccessories = p.equippedAccessories.filter((id) => id !== accessoryId);
  } else {
    p.equippedAccessories.push(accessoryId);
  }
  saveProgress(p);
}

function pickRandomSticker(pool: Sticker[], collected: string[]): Sticker {
  const uncollected = pool.filter((s) => !collected.includes(s.id));
  const source = uncollected.length > 0 ? uncollected : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function awardSticker(progress: PlayerProgress): { sticker: Sticker; isRare: boolean; isNew: boolean } {
  const count = progress.puzzlesCompleted;
  const common = STICKERS.filter((s) => !s.rare);
  const rare = STICKERS.filter((s) => s.rare);

  let sticker: Sticker;
  let isRare = false;

  if (count === 1) {
    sticker = pickRandomSticker(common, progress.stickersCollected);
  } else if (count % 5 === 0) {
    sticker = pickRandomSticker(rare, progress.stickersCollected);
    isRare = true;
  } else {
    sticker = pickRandomSticker(STICKERS, progress.stickersCollected);
    isRare = sticker.rare;
  }

  const isNew = !progress.stickersCollected.includes(sticker.id);
  if (isNew) progress.stickersCollected.push(sticker.id);

  return { sticker, isRare, isNew };
}

function checkAchievements(progress: PlayerProgress): Achievement[] {
  const unlocked: Achievement[] = [];
  const count = progress.puzzlesCompleted;
  const allStickers = progress.stickersCollected.length >= STICKERS.length;

  const checks = [
    { id: 'first-puzzle', met: count >= 1 },
    { id: 'five-puzzles', met: count >= 5 },
    { id: 'ten-puzzles', met: count >= 10 },
    { id: 'twenty-five-puzzles', met: count >= 25 },
    { id: 'fifty-puzzles', met: count >= 50 },
    { id: 'puzzle-master', met: allStickers },
  ];

  for (const check of checks) {
    if (check.met && !progress.achievementsUnlocked.includes(check.id)) {
      progress.achievementsUnlocked.push(check.id);
      const achievement = ACHIEVEMENTS.find((a) => a.id === check.id);
      if (achievement) unlocked.push(achievement);
    }
  }

  return unlocked;
}

export function unlockCollectionItem(itemId: string): boolean {
  const p = loadProgress();
  if (p.collectionUnlocked.includes(itemId)) return false;
  p.collectionUnlocked.push(itemId);
  saveProgress(p);
  return true;
}

export function exploreTopic(topicId: string): void {
  const p = loadProgress();
  if (!p.topicsExplored.includes(topicId)) {
    p.topicsExplored.push(topicId);
    saveProgress(p);
  }
}

export function recordPuzzleComplete(params: {
  hintsUsed: number;
  elapsedSeconds: number;
  gridSize: GridSize;
  categoryId?: string;
  packImageId?: string;
}): VictoryResult {
  const progress = loadProgress();

  progress.puzzlesCompleted += 1;
  progress.totalHintsUsed += params.hintsUsed;
  progress.solveTimes.push(params.elapsedSeconds);

  const diffKey = String(params.gridSize);
  progress.difficultyCounts[diffKey] = (progress.difficultyCounts[diffKey] ?? 0) + 1;

  if (params.categoryId) {
    progress.categoryCounts[params.categoryId] =
      (progress.categoryCounts[params.categoryId] ?? 0) + 1;
  }

  if (progress.fastestSolve === null || params.elapsedSeconds < progress.fastestSolve) {
    progress.fastestSolve = params.elapsedSeconds;
  }

  const starsEarned = STAR_REWARDS[params.gridSize];
  progress.totalStars += starsEarned;

  progress.recentPuzzles.push({
    gridSize: params.gridSize,
    elapsedSeconds: params.elapsedSeconds,
    hintsUsed: params.hintsUsed,
    categoryId: params.categoryId,
  });
  if (progress.recentPuzzles.length > 10) {
    progress.recentPuzzles = progress.recentPuzzles.slice(-10);
  }

  let newCollectionItem: string | undefined;
  if (params.packImageId) {
    const colId = `col-${params.packImageId}`;
    if (!progress.collectionUnlocked.includes(colId)) {
      progress.collectionUnlocked.push(colId);
      newCollectionItem = colId;
    }
    if (!progress.topicsExplored.includes(params.packImageId)) {
      progress.topicsExplored.push(params.packImageId);
    }
  }

  const { sticker, isRare, isNew } = awardSticker(progress);
  const newAchievements = checkAchievements(progress);

  saveProgress(progress);

  updateWeeklyStats({
    gridSize: params.gridSize,
    starsEarned,
    categoryId: params.categoryId,
  });

  let totalXp = xpForPuzzleComplete();
  totalXp += newAchievements.length * xpForAchievement();
  const xpResult = addAvatarXP(totalXp);

  return {
    sticker,
    isRare,
    isNewSticker: isNew,
    newAchievements,
    totalCompleted: progress.puzzlesCompleted,
    starsEarned,
    xpEarned: xpResult.xpEarned,
    avatarLevel: xpResult.newLevel,
    leveledUp: xpResult.leveledUp,
    newCollectionItem,
  };
}

export function getParentInsights(): ParentInsightsV3 {
  const p = loadProgress();
  const total = p.solveTimes.length;
  const avg = total > 0 ? Math.round(p.solveTimes.reduce((a, b) => a + b, 0) / total) : 0;

  let favoriteDifficulty = '—';
  let maxCount = 0;
  for (const [size, count] of Object.entries(p.difficultyCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteDifficulty = `${size}×${size}`;
    }
  }

  let favoriteCategory = '—';
  let maxCat = 0;
  for (const [cat, count] of Object.entries(p.categoryCounts)) {
    if (count > maxCat) {
      maxCat = count;
      favoriteCategory = cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  }

  const sessionTotal = p.sessionDurations.length;
  const avgSession =
    sessionTotal > 0
      ? Math.round(p.sessionDurations.reduce((a, b) => a + b, 0) / sessionTotal)
      : 0;

  const puzzlesThisWeek = p.weeklyPuzzles;

  const learningSummary =
    p.puzzlesCompleted > 0
      ? `Your child completed ${puzzlesThisWeek} puzzle${puzzlesThisWeek === 1 ? '' : 's'} recently` +
        (favoriteCategory !== '—' ? ` and spent most time on ${favoriteCategory.toLowerCase()} puzzles.` : '.')
      : 'Start playing to see learning progress!';

  const difficulties = Object.keys(p.difficultyCounts).map(Number).sort((a, b) => a - b);
  const difficultyProgression =
    difficulties.length >= 2
      ? `Improved from ${difficulties[0]}×${difficulties[0]} toward ${difficulties[difficulties.length - 1]}×${difficulties[difficulties.length - 1]}`
      : difficulties.length === 1
        ? `Currently playing ${difficulties[0]}×${difficulties[0]} puzzles`
        : '—';

  const collectionPercent =
    COLLECTION_ITEMS.length > 0
      ? Math.round((p.collectionUnlocked.length / COLLECTION_ITEMS.length) * 100)
      : 0;

  const learningSummaryV3 =
    p.puzzlesCompleted > 0
      ? `Your child completed ${puzzlesThisWeek} puzzle${puzzlesThisWeek === 1 ? '' : 's'} this week, explored ${p.topicsExplored.length} educational topic${p.topicsExplored.length === 1 ? '' : 's'}, and ${difficultyProgression.toLowerCase()}.`
      : 'Start playing to see learning progress!';

  return {
    totalPuzzles: p.puzzlesCompleted,
    favoriteDifficulty,
    averageSolveTime: avg,
    fastestSolve: p.fastestSolve,
    totalHintsUsed: p.totalHintsUsed,
    achievementProgress: {
      unlocked: p.achievementsUnlocked.length,
      total: ACHIEVEMENTS.length,
    },
    stickersCollected: p.stickersCollected.length,
    stickersTotal: STICKERS.length,
    totalStars: p.totalStars,
    totalSessions: p.totalSessions,
    averageSessionDuration: avgSession,
    favoriteCategory,
    puzzlesThisWeek,
    learningSummary,
    avatarLevel: getAvatarLevel(p.avatarXP),
    avatarXP: p.avatarXP,
    weeklyPuzzles: p.weeklyPuzzles,
    weeklyChallengesCompleted: p.weeklyChallengesClaimed.length,
    topicsExplored: p.topicsExplored.length,
    collectionPercent,
    difficultyProgression,
    learningSummaryV3,
  };
}

export function getCollectedStickers(): string[] {
  return loadProgress().stickersCollected;
}

export function getUnlockedAchievements(): string[] {
  return loadProgress().achievementsUnlocked;
}

export function isReturningPlayer(): boolean {
  const p = loadProgress();
  return p.puzzlesCompleted > 0 && p.avatarId !== null;
}

export function resetProgress(): void {
  saveProgress(freshProgress());
}
