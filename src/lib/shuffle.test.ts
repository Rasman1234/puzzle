import { describe, it, expect } from 'vitest';
import { shufflePieces } from './shuffle';
import { createPieces } from './puzzleGenerator';
import { isPuzzleComplete } from './completionDetector';

describe('shufflePieces', () => {
  it('returns same number of pieces', () => {
    const pieces = createPieces(3);
    const shuffled = shufflePieces(pieces);
    expect(shuffled).toHaveLength(9);
  });

  it('does not return solved puzzle', () => {
    for (let i = 0; i < 20; i++) {
      const pieces = createPieces(3);
      const shuffled = shufflePieces(pieces);
      expect(isPuzzleComplete(shuffled)).toBe(false);
    }
  });

  it('preserves all piece ids', () => {
    const pieces = createPieces(4);
    const shuffled = shufflePieces(pieces);
    const originalIds = pieces.map((p) => p.id).sort();
    const shuffledIds = shuffled.map((p) => p.id).sort();
    expect(shuffledIds).toEqual(originalIds);
  });
});
