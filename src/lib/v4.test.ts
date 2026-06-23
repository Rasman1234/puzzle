import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  resetProgress,
  loadProgress,
  recordPuzzleComplete,
  saveProgress,
  getParentInsights,
  exploreTopic,
} from './playerProgress';
import {
  getWeekKey,
  generateWeeklyChallenges,
  ensureWeeklyChallenges,
  updateWeeklyStats,
  claimWeeklyChallenge,
  isWeeklyChallengeComplete,
} from './weeklyChallenges';
import { openMysteryBox, applyMysteryReward } from './mysteryBox';
import {
  getAvatarLevel,
  addAvatarXP,
  xpForPuzzleComplete,
  xpForWeeklyChallenge,
} from './avatarLevels';
import { getActiveSeasonalEvent, claimSeasonalReward, isSeasonalRewardClaimed } from './seasonalEvents';
import { CERTIFICATE_TEMPLATES } from './certificateGenerator';
import { getEducationalDiscovery, COLLECTION_ITEMS, getCollectionByCategory } from '../data/v4Content';

describe('weekly challenges', () => {
  beforeEach(() => resetProgress());

  it('generates deterministic challenges per week', () => {
    const week = '2026-W25';
    const a = generateWeeklyChallenges(week);
    const b = generateWeeklyChallenges(week);
    expect(a).toHaveLength(3);
    expect(a.map((c) => c.id)).toEqual(b.map((c) => c.id));
  });

  it('resets progress on new week', () => {
    const p = loadProgress();
    p.weeklyWeekKey = '2020-W1';
    p.weeklyPuzzles = 99;
    saveProgress(p);
    ensureWeeklyChallenges();
    expect(loadProgress().weeklyPuzzles).toBe(0);
    expect(loadProgress().weeklyWeekKey).toBe(getWeekKey());
  });

  it('tracks puzzle and star progress', () => {
    ensureWeeklyChallenges();
    updateWeeklyStats({ gridSize: 3, starsEarned: 2, categoryId: 'dinosaurs' });
    const p = loadProgress();
    expect(p.weeklyPuzzles).toBe(1);
    expect(p.weeklyStarsEarned).toBe(2);
    expect(p.weeklyCategoryCounts.dinosaurs).toBe(1);
  });

  it('claims reward when challenge complete', () => {
    ensureWeeklyChallenges();
    const challenges = ensureWeeklyChallenges();
    const puzzleChallenge = challenges.find((c) => c.type === 'puzzles');
    expect(puzzleChallenge).toBeDefined();

    for (let i = 0; i < (puzzleChallenge!.target); i++) {
      updateWeeklyStats({ gridSize: 3, starsEarned: 2 });
    }
    expect(isWeeklyChallengeComplete(puzzleChallenge!)).toBe(true);

    const starsBefore = loadProgress().totalStars;
    expect(claimWeeklyChallenge(puzzleChallenge!.id)).toBe(true);
    expect(loadProgress().totalStars).toBeGreaterThan(starsBefore);
    expect(claimWeeklyChallenge(puzzleChallenge!.id)).toBe(false);
  });
});

describe('mystery box', () => {
  beforeEach(() => resetProgress());

  it('applies star reward', () => {
    applyMysteryReward({
      type: 'stars',
      amount: 5,
      label: '5 Stars!',
      emoji: '⭐',
    });
    expect(loadProgress().totalStars).toBe(5);
  });

  it('openMysteryBox returns valid reward', () => {
    const reward = openMysteryBox();
    expect(reward.label).toBeTruthy();
    expect(reward.emoji).toBeTruthy();
    expect(['stars', 'bonus_stars', 'sticker', 'accessory', 'rare_sticker']).toContain(reward.type);
  });
});

describe('avatar levels', () => {
  beforeEach(() => resetProgress());

  it('starts at level 1', () => {
    expect(getAvatarLevel(0)).toBe(1);
  });

  it('levels up with XP', () => {
    const result = addAvatarXP(60);
    expect(result.xpEarned).toBe(60);
    expect(result.newLevel).toBeGreaterThanOrEqual(2);
    expect(result.leveledUp).toBe(true);
  });

  it('awards XP on puzzle complete', () => {
    const result = recordPuzzleComplete({
      hintsUsed: 0,
      elapsedSeconds: 30,
      gridSize: 3,
      packImageId: 'rocket-pack',
      categoryId: 'space',
    });
    expect(result.xpEarned).toBeGreaterThanOrEqual(xpForPuzzleComplete());
    expect(result.newAchievements.length).toBeGreaterThanOrEqual(1);
  });

  it('weekly challenge XP is defined', () => {
    expect(xpForWeeklyChallenge()).toBeGreaterThan(0);
  });
});

describe('seasonal events', () => {
  beforeEach(() => resetProgress());

  it('detects active event by date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15'));
    const event = getActiveSeasonalEvent();
    expect(event?.id).toBe('summer-adventure');
    vi.useRealTimers();
  });

  it('claims seasonal reward once', () => {
    expect(claimSeasonalReward('summer-adventure')).toBe(true);
    expect(isSeasonalRewardClaimed('summer-adventure')).toBe(true);
    expect(claimSeasonalReward('summer-adventure')).toBe(false);
    expect(loadProgress().totalStars).toBe(15);
  });
});

describe('certificates', () => {
  it('has certificate templates', () => {
    expect(CERTIFICATE_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    expect(CERTIFICATE_TEMPLATES[0].title).toBe('Puzzle Explorer');
  });
});

describe('educational discovery', () => {
  beforeEach(() => resetProgress());

  it('returns discovery for pack image', () => {
    const d = getEducationalDiscovery('rocket-pack');
    expect(d).not.toBeNull();
    expect(d?.quiz.options).toHaveLength(3);
    expect(d?.quiz.encouragement).toBeTruthy();
  });

  it('tracks explored topics', () => {
    exploreTopic('rocket-pack');
    expect(loadProgress().topicsExplored).toContain('rocket-pack');
    const insights = getParentInsights();
    expect(insights.topicsExplored).toBeGreaterThanOrEqual(1);
  });
});

describe('collection book', () => {
  beforeEach(() => resetProgress());

  it('has items per category', () => {
    const animals = getCollectionByCategory('animals');
    expect(animals.length).toBeGreaterThan(0);
    expect(COLLECTION_ITEMS.length).toBeGreaterThan(animals.length);
  });

  it('unlocks collection on puzzle complete', () => {
    recordPuzzleComplete({
      hintsUsed: 0,
      elapsedSeconds: 40,
      gridSize: 3,
      packImageId: 'rocket-pack',
      categoryId: 'space',
    });
    expect(loadProgress().collectionUnlocked).toContain('col-rocket-pack');
  });
});
