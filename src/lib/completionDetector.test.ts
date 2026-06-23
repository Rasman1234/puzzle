import { describe, it, expect } from 'vitest';
import { isPuzzleComplete } from '../lib/completionDetector';
import type { PuzzlePieceData } from '../types/puzzle';

function makePiece(
  row: number,
  col: number,
  currentRow: number,
  currentCol: number,
): PuzzlePieceData {
  return {
    id: `piece-${row}-${col}`,
    correctPosition: { row, col },
    currentPosition: { row: currentRow, col: currentCol },
  };
}

describe('isPuzzleComplete', () => {
  it('returns true when all pieces are in correct positions', () => {
    const pieces = [
      makePiece(0, 0, 0, 0),
      makePiece(0, 1, 0, 1),
      makePiece(1, 0, 1, 0),
      makePiece(1, 1, 1, 1),
    ];
    expect(isPuzzleComplete(pieces)).toBe(true);
  });

  it('returns false when any piece is misplaced', () => {
    const pieces = [
      makePiece(0, 0, 0, 1),
      makePiece(0, 1, 0, 0),
      makePiece(1, 0, 1, 0),
      makePiece(1, 1, 1, 1),
    ];
    expect(isPuzzleComplete(pieces)).toBe(false);
  });

  it('returns true for empty array', () => {
    expect(isPuzzleComplete([])).toBe(true);
  });
});
