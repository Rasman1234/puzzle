import { describe, it, expect } from 'vitest';
import {
  STICKERS,
  ACHIEVEMENTS,
  PUZZLE_PACKS,
  DIFFICULTY_LABELS,
  AVATARS,
  ACCESSORIES,
  STAR_REWARDS,
  getStickerById,
  getAchievementById,
} from './content';

describe('content data', () => {
  it('has 8 stickers including rare ones', () => {
    expect(STICKERS).toHaveLength(8);
    expect(STICKERS.filter((s) => s.rare)).toHaveLength(4);
  });

  it('has 6 achievements', () => {
    expect(ACHIEVEMENTS).toHaveLength(6);
  });

  it('has 5 puzzle pack categories', () => {
    expect(PUZZLE_PACKS).toHaveLength(5);
    const categories = PUZZLE_PACKS.map((p) => p.id);
    expect(categories).toContain('animals');
    expect(categories).toContain('dinosaurs');
    expect(categories).toContain('space');
    expect(categories).toContain('ocean');
    expect(categories).toContain('cars');
  });

  it('each pack has 3 images with facts', () => {
    for (const pack of PUZZLE_PACKS) {
      expect(pack.images).toHaveLength(3);
      for (const img of pack.images) {
        expect(img.path).toMatch(/^\/packs\//);
        expect(img.width).toBe(400);
        expect(img.fact.length).toBeGreaterThan(10);
      }
    }
  });

  it('has smart difficulty labels for all grid sizes', () => {
    expect(DIFFICULTY_LABELS[2].label).toBe('Easy');
    expect(DIFFICULTY_LABELS[6].label).toBe('Master');
    expect(DIFFICULTY_LABELS[2].emoji).toBe('🐣');
  });

  it('getStickerById returns sticker', () => {
    expect(getStickerById('puppy')?.emoji).toBe('🐶');
  });

  it('has 6 avatars', () => {
    expect(AVATARS).toHaveLength(6);
  });

  it('has accessories with star costs', () => {
    expect(ACCESSORIES.every((a) => a.starCost > 0)).toBe(true);
  });

  it('has star rewards for all grid sizes', () => {
    expect(STAR_REWARDS[2]).toBe(1);
    expect(STAR_REWARDS[6]).toBe(5);
  });

  it('getAchievementById returns achievement', () => {
    expect(getAchievementById('first-puzzle')?.name).toBe('First Puzzle');
  });
});
