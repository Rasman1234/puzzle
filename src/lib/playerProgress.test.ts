import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProgress,
  saveProgress,
  recordPuzzleComplete,
  getParentInsights,
  resetProgress,
} from './playerProgress';
import { STICKERS } from '../data/content';

describe('playerProgress', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('starts with empty progress', () => {
    const p = loadProgress();
    expect(p.puzzlesCompleted).toBe(0);
    expect(p.stickersCollected).toEqual([]);
  });

  it('awards a sticker on first puzzle', () => {
    const result = recordPuzzleComplete({
      hintsUsed: 0,
      elapsedSeconds: 60,
      gridSize: 3,
    });
    expect(result.sticker).toBeDefined();
    expect(result.starsEarned).toBe(2);
    expect(result.totalCompleted).toBe(1);
    expect(result.newAchievements.some((a) => a.id === 'first-puzzle')).toBe(true);
  });

  it('awards rare sticker every 5 puzzles', () => {
    for (let i = 0; i < 4; i++) {
      recordPuzzleComplete({ hintsUsed: 0, elapsedSeconds: 30, gridSize: 2 });
    }
    const fifth = recordPuzzleComplete({ hintsUsed: 0, elapsedSeconds: 30, gridSize: 2 });
    expect(fifth.isRare).toBe(true);
    expect(fifth.totalCompleted).toBe(5);
    expect(fifth.newAchievements.some((a) => a.id === 'five-puzzles')).toBe(true);
  });

  it('tracks parent insights', () => {
    resetProgress();
    recordPuzzleComplete({ hintsUsed: 2, elapsedSeconds: 45, gridSize: 3 });
    recordPuzzleComplete({ hintsUsed: 1, elapsedSeconds: 90, gridSize: 4 });

    const progress = loadProgress();
    expect(progress.solveTimes).toEqual([45, 90]);

    const insights = getParentInsights();
    expect(insights.totalPuzzles).toBe(2);
    expect(insights.totalHintsUsed).toBe(3);
    expect(insights.averageSolveTime).toBe(68);
    expect(insights.fastestSolve).toBe(45);
  });

  it('unlocks puzzle master when all stickers collected', () => {
    const progress = loadProgress();
    progress.puzzlesCompleted = 10;
    progress.stickersCollected = STICKERS.map((s) => s.id);
    progress.achievementsUnlocked = [];
    saveProgress(progress);

    const result = recordPuzzleComplete({ hintsUsed: 0, elapsedSeconds: 30, gridSize: 2 });
    expect(result.newAchievements.some((a) => a.id === 'puzzle-master')).toBe(true);
  });

  it('persists to localStorage', () => {
    recordPuzzleComplete({ hintsUsed: 0, elapsedSeconds: 30, gridSize: 2 });
    const loaded = loadProgress();
    expect(loaded.puzzlesCompleted).toBe(1);
  });
});
