import type { CSSProperties } from 'react';
import type { GridPosition, PuzzlePieceData, GridSize } from '../types/puzzle';

export function positionKey(pos: GridPosition): string {
  return `${pos.row}-${pos.col}`;
}

export function createPieces(gridSize: GridSize): PuzzlePieceData[] {
  const pieces: PuzzlePieceData[] = [];
  let id = 0;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      pieces.push({
        id: `piece-${id++}`,
        correctPosition: { row, col },
        currentPosition: { row, col },
      });
    }
  }

  return pieces;
}

export function getBackgroundStyle(
  imageUrl: string,
  gridSize: GridSize,
  correctPosition: GridPosition,
): CSSProperties {
  const { row, col } = correctPosition;
  const xPercent = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
  const yPercent = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
    backgroundRepeat: 'no-repeat',
  };
}

// Re-export for non-React usage in tests
export function getBackgroundValues(
  gridSize: GridSize,
  correctPosition: GridPosition,
): { backgroundSize: string; backgroundPosition: string } {
  const { row, col } = correctPosition;
  const xPercent = gridSize > 1 ? (col / (gridSize - 1)) * 100 : 0;
  const yPercent = gridSize > 1 ? (row / (gridSize - 1)) * 100 : 0;

  return {
    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
    backgroundPosition: `${xPercent}% ${yPercent}%`,
  };
}

export function findPieceAt(
  pieces: PuzzlePieceData[],
  position: GridPosition,
): PuzzlePieceData | undefined {
  return pieces.find(
    (p) =>
      p.currentPosition.row === position.row &&
      p.currentPosition.col === position.col,
  );
}

export function swapPieces(
  pieces: PuzzlePieceData[],
  idA: string,
  idB: string,
): PuzzlePieceData[] {
  const pieceA = pieces.find((p) => p.id === idA);
  const pieceB = pieces.find((p) => p.id === idB);
  if (!pieceA || !pieceB) return pieces;

  const posA = { ...pieceA.currentPosition };
  const posB = { ...pieceB.currentPosition };

  return pieces.map((p) => {
    if (p.id === idA) return { ...p, currentPosition: posB };
    if (p.id === idB) return { ...p, currentPosition: posA };
    return p;
  });
}

export function movePieceToPosition(
  pieces: PuzzlePieceData[],
  pieceId: string,
  target: GridPosition,
): PuzzlePieceData[] {
  const dragged = pieces.find((p) => p.id === pieceId);
  const occupant = findPieceAt(pieces, target);
  if (!dragged || !occupant || dragged.id === occupant.id) return pieces;
  return swapPieces(pieces, dragged.id, occupant.id);
}
