import type { GridPosition, PuzzlePieceData } from '../types/puzzle';

export interface HintResult {
  pieceId: string;
  correctPosition: GridPosition;
}

export function findHintTarget(pieces: PuzzlePieceData[]): HintResult | null {
  const misplaced = pieces.filter(
    (p) =>
      p.currentPosition.row !== p.correctPosition.row ||
      p.currentPosition.col !== p.correctPosition.col,
  );

  if (misplaced.length === 0) return null;

  const piece = misplaced[0];
  return {
    pieceId: piece.id,
    correctPosition: { ...piece.correctPosition },
  };
}

export function applyHint(
  pieces: PuzzlePieceData[],
  hint: HintResult,
): PuzzlePieceData[] {
  const piece = pieces.find((p) => p.id === hint.pieceId);
  if (!piece) return pieces;

  const target = hint.correctPosition;
  const occupant = pieces.find(
    (p) =>
      p.currentPosition.row === target.row &&
      p.currentPosition.col === target.col,
  );

  if (!occupant) return pieces;

  const piecePos = { ...piece.currentPosition };
  const occupantPos = { ...occupant.currentPosition };

  return pieces.map((p) => {
    if (p.id === piece.id) return { ...p, currentPosition: occupantPos };
    if (p.id === occupant.id) return { ...p, currentPosition: piecePos };
    return p;
  });
}
