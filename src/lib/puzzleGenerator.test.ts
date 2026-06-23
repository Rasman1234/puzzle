import { describe, it, expect } from 'vitest';
import {
  createPieces,
  getBackgroundValues,
  swapPieces,
  findPieceAt,
} from './puzzleGenerator';

describe('createPieces', () => {
  it('creates correct number of pieces for 3x3', () => {
    const pieces = createPieces(3);
    expect(pieces).toHaveLength(9);
  });

  it('assigns unique correct positions', () => {
    const pieces = createPieces(2);
    const positions = pieces.map(
      (p) => `${p.correctPosition.row}-${p.correctPosition.col}`,
    );
    expect(new Set(positions).size).toBe(4);
  });

  it('starts with current equal to correct', () => {
    const pieces = createPieces(2);
    for (const piece of pieces) {
      expect(piece.currentPosition).toEqual(piece.correctPosition);
    }
  });
});

describe('getBackgroundValues', () => {
  it('calculates corner positions correctly for 3x3', () => {
    expect(getBackgroundValues(3, { row: 0, col: 0 })).toEqual({
      backgroundSize: '300% 300%',
      backgroundPosition: '0% 0%',
    });
    expect(getBackgroundValues(3, { row: 2, col: 2 })).toEqual({
      backgroundSize: '300% 300%',
      backgroundPosition: '100% 100%',
    });
    expect(getBackgroundValues(3, { row: 1, col: 1 })).toEqual({
      backgroundSize: '300% 300%',
      backgroundPosition: '50% 50%',
    });
  });
});

describe('swapPieces', () => {
  it('swaps current positions of two pieces', () => {
    const pieces = createPieces(2);
    const shuffled = swapPieces(pieces, 'piece-0', 'piece-1');
    const p0 = shuffled.find((p) => p.id === 'piece-0')!;
    const p1 = shuffled.find((p) => p.id === 'piece-1')!;
    expect(p0.currentPosition).toEqual(pieces[1].currentPosition);
    expect(p1.currentPosition).toEqual(pieces[0].currentPosition);
  });
});

describe('findPieceAt', () => {
  it('finds piece at given position', () => {
    const pieces = createPieces(2);
    const found = findPieceAt(pieces, { row: 1, col: 0 });
    expect(found?.correctPosition).toEqual({ row: 1, col: 0 });
  });
});
