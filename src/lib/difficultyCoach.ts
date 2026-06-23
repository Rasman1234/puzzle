import type { GridSize } from '../types/puzzle';
import { DIFFICULTY_LABELS } from '../data/content';
import type { PlayerProgress } from './playerProgress';

export interface DifficultyRecommendation {
  message: string;
  suggestedSize?: GridSize;
  type: 'upgrade' | 'downgrade' | 'none';
}

const GRID_ORDER: GridSize[] = [2, 3, 4, 5, 6];

export function getDifficultyRecommendation(progress: PlayerProgress): DifficultyRecommendation {
  const recent = progress.recentPuzzles.slice(-3);
  if (recent.length < 3) {
    return { message: '', type: 'none' };
  }

  const allFast = recent.every((p) => p.elapsedSeconds < 90 && p.hintsUsed === 0);
  const allHintHeavy = recent.every((p) => p.hintsUsed >= 2);

  if (allFast) {
    const maxSize = Math.max(...recent.map((p) => p.gridSize)) as GridSize;
    const idx = GRID_ORDER.indexOf(maxSize);
    if (idx < GRID_ORDER.length - 1) {
      const next = GRID_ORDER[idx + 1];
      const label = DIFFICULTY_LABELS[next];
      return {
        message: `${label.emoji} Ready for ${label.label}?`,
        suggestedSize: next,
        type: 'upgrade',
      };
    }
  }

  if (allHintHeavy) {
    const maxSize = Math.max(...recent.map((p) => p.gridSize)) as GridSize;
    const idx = GRID_ORDER.indexOf(maxSize);
    if (idx > 0) {
      const easier = GRID_ORDER[idx - 1];
      const label = DIFFICULTY_LABELS[easier];
      return {
        message: `${label.emoji} ${label.label} mode might help!`,
        suggestedSize: easier,
        type: 'downgrade',
      };
    }
  }

  return { message: '', type: 'none' };
}
