import type { PuzzlePieceData } from '../types/puzzle';

export function isPuzzleComplete(pieces: PuzzlePieceData[]): boolean {
  return pieces.every(
    (piece) =>
      piece.currentPosition.row === piece.correctPosition.row &&
      piece.currentPosition.col === piece.correctPosition.col,
  );
}
