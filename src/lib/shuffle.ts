import type { PuzzlePieceData } from '../types/puzzle';
import { isPuzzleComplete } from './completionDetector';

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shufflePieces(pieces: PuzzlePieceData[]): PuzzlePieceData[] {
  const positions = pieces.map((p) => p.currentPosition);
  let shuffledPositions = shuffleArray(positions);

  let attempts = 0;
  while (attempts < 50) {
    const shuffled = pieces.map((piece, index) => ({
      ...piece,
      currentPosition: { ...shuffledPositions[index] },
    }));

    if (!isPuzzleComplete(shuffled)) {
      return shuffled;
    }

    shuffledPositions = shuffleArray(positions);
    attempts++;
  }

  // Fallback: swap first two pieces
  const fallback = pieces.map((p) => ({ ...p, currentPosition: { ...p.currentPosition } }));
  if (fallback.length >= 2) {
    const tmp = { ...fallback[0].currentPosition };
    fallback[0].currentPosition = { ...fallback[1].currentPosition };
    fallback[1].currentPosition = tmp;
  }
  return fallback;
}
