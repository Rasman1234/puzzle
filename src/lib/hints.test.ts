import { describe, it, expect } from 'vitest';
import { findHintTarget, applyHint } from './hints';
import { createPieces } from './puzzleGenerator';
import { shufflePieces } from './shuffle';

describe('hints', () => {
  it('finds a misplaced piece', () => {
    const pieces = shufflePieces(createPieces(2));
    const hint = findHintTarget(pieces);
    expect(hint).not.toBeNull();
    expect(hint?.pieceId).toBeTruthy();
    expect(hint?.correctPosition).toBeDefined();
  });

  it('returns null when puzzle is solved', () => {
    const pieces = createPieces(2);
    expect(findHintTarget(pieces)).toBeNull();
  });

  it('moves a piece toward correct position', () => {
    const pieces = shufflePieces(createPieces(2));
    const hint = findHintTarget(pieces)!;
    const updated = applyHint(pieces, hint);
    const piece = updated.find((p) => p.id === hint.pieceId)!;
    expect(piece.currentPosition).toEqual(hint.correctPosition);
  });
});
