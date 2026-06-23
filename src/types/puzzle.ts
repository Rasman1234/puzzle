export interface GridPosition {
  row: number;
  col: number;
}

export interface PuzzlePieceData {
  id: string;
  correctPosition: GridPosition;
  currentPosition: GridPosition;
}

export type GridSize = 2 | 3 | 4 | 5 | 6;

export type GamePhase = 'menu' | 'setup' | 'playing' | 'victory';

export interface PuzzleConfig {
  imageUrl: string;
  gridSize: GridSize;
  imageWidth: number;
  imageHeight: number;
  packImageId?: string;
  categoryId?: string;
}

export interface GameStats {
  moves: number;
  hintsUsed: number;
  startTime: number;
}

export const GRID_SIZES: GridSize[] = [2, 3, 4, 5, 6];

export const MAX_HINTS = 3;

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const MIN_IMAGE_DIMENSION = 200;
export const MAX_IMAGE_DIMENSION = 1200;
