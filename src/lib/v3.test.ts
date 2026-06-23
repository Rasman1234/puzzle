import { describe, it, expect, beforeEach } from 'vitest';
import { isSoundEnabled, setSoundEnabled } from './audio';
import {
  resetProgress,
  loadProgress,
  setAvatar,
  unlockAccessory,
  recordPuzzleComplete,
  saveProgress,
} from './playerProgress';
import { isDailyRewardAvailable, claimDailyReward } from './dailyReward';
import { getDifficultyRecommendation } from './difficultyCoach';
import { getFunFactForImageId } from '../data/content';

describe('audio', () => {
  beforeEach(() => resetProgress());

  it('sound is disabled by default', () => {
    expect(isSoundEnabled()).toBe(false);
  });

  it('can enable sound', () => {
    setSoundEnabled(true);
    expect(isSoundEnabled()).toBe(true);
  });
});

describe('avatar system', () => {
  beforeEach(() => resetProgress());

  it('sets avatar', () => {
    setAvatar('leo');
    expect(loadProgress().avatarId).toBe('leo');
  });
});

describe('stars and accessories', () => {
  beforeEach(() => resetProgress());

  it('awards stars on puzzle complete', () => {
    const result = recordPuzzleComplete({ hintsUsed: 0, elapsedSeconds: 60, gridSize: 3 });
    expect(result.starsEarned).toBe(2);
    expect(loadProgress().totalStars).toBe(2);
  });

  it('unlocks accessory with stars', () => {
    const p = loadProgress();
    p.totalStars = 20;
    saveProgress(p);
    expect(unlockAccessory('hat')).toBe(true);
    expect(loadProgress().unlockedAccessories).toContain('hat');
    expect(loadProgress().totalStars).toBe(10);
  });
});

describe('daily reward', () => {
  beforeEach(() => resetProgress());

  it('is available on first visit', () => {
    expect(isDailyRewardAvailable()).toBe(true);
  });

  it('cannot claim twice same day', () => {
    claimDailyReward();
    expect(isDailyRewardAvailable()).toBe(false);
  });
});

describe('difficultyCoach', () => {
  beforeEach(() => resetProgress());

  it('suggests upgrade after fast solves', () => {
    const p = loadProgress();
    p.recentPuzzles = [
      { gridSize: 3, elapsedSeconds: 45, hintsUsed: 0 },
      { gridSize: 3, elapsedSeconds: 50, hintsUsed: 0 },
      { gridSize: 3, elapsedSeconds: 40, hintsUsed: 0 },
    ];
    saveProgress(p);
    const rec = getDifficultyRecommendation(loadProgress());
    expect(rec.type).toBe('upgrade');
  });

  it('suggests downgrade after heavy hints', () => {
    const p = loadProgress();
    p.recentPuzzles = [
      { gridSize: 4, elapsedSeconds: 200, hintsUsed: 3 },
      { gridSize: 4, elapsedSeconds: 180, hintsUsed: 2 },
      { gridSize: 4, elapsedSeconds: 190, hintsUsed: 3 },
    ];
    saveProgress(p);
    const rec = getDifficultyRecommendation(loadProgress());
    expect(rec.type).toBe('downgrade');
  });
});

describe('educational facts', () => {
  it('returns fact for pack image', () => {
    const fact = getFunFactForImageId('rocket-pack');
    expect(fact).not.toBeNull();
    expect(fact?.title).toBe('Rocket');
    expect(fact?.fact).toContain('faster');
  });

  it('returns null for unknown image', () => {
    expect(getFunFactForImageId('unknown')).toBeNull();
  });
});
