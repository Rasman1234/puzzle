import { useCallback, useState } from 'react';
import type {
  GamePhase,
  GameStats,
  GridSize,
  PuzzleConfig,
  PuzzlePieceData,
} from '../types/puzzle';
import { MAX_HINTS } from '../types/puzzle';
import { isPuzzleComplete } from '../lib/completionDetector';
import { createPieces, movePieceToPosition } from '../lib/puzzleGenerator';
import { shufflePieces } from '../lib/shuffle';
import { applyHint, findHintTarget, type HintResult } from '../lib/hints';

interface UsePuzzleGameReturn {
  phase: GamePhase;
  config: PuzzleConfig | null;
  pieces: PuzzlePieceData[];
  stats: GameStats;
  ghostMode: boolean;
  hintsRemaining: number;
  activeHint: HintResult | null;
  isComplete: boolean;
  setImage: (
    url: string,
    width: number,
    height: number,
    meta?: { packImageId?: string; categoryId?: string },
  ) => void;
  setGridSize: (size: GridSize) => void;
  startGame: () => void;
  swapPieces: (activeId: string, overId: string) => void;
  toggleGhostMode: () => void;
  useHint: () => void;
  playAgain: () => void;
  newPuzzle: () => void;
}

const initialStats: GameStats = {
  moves: 0,
  hintsUsed: 0,
  startTime: 0,
};

export function usePuzzleGame(): UsePuzzleGameReturn {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [config, setConfig] = useState<PuzzleConfig | null>(null);
  const [pieces, setPieces] = useState<PuzzlePieceData[]>([]);
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [ghostMode, setGhostMode] = useState(false);
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);

  const hintsRemaining = MAX_HINTS - stats.hintsUsed;
  const isComplete = pieces.length > 0 && isPuzzleComplete(pieces);

  const setImage = useCallback((
    url: string,
    width: number,
    height: number,
    meta?: { packImageId?: string; categoryId?: string },
  ) => {
    setConfig((prev) => ({
      imageUrl: url,
      gridSize: prev?.gridSize ?? 3,
      imageWidth: width,
      imageHeight: height,
      packImageId: meta?.packImageId,
      categoryId: meta?.categoryId,
    }));
    setPhase('setup');
    setActiveHint(null);
  }, []);

  const setGridSize = useCallback((size: GridSize) => {
    setConfig((prev) => (prev ? { ...prev, gridSize: size } : null));
  }, []);

  const startGame = useCallback(() => {
    if (!config) return;
    const newPieces = shufflePieces(createPieces(config.gridSize));
    setPieces(newPieces);
    setStats({ moves: 0, hintsUsed: 0, startTime: Date.now() });
    setActiveHint(null);
    setPhase('playing');
  }, [config]);

  const swapPieces = useCallback(
    (activeId: string, overId: string) => {
      if (phase !== 'playing' || isComplete) return;

      setPieces((prev) => {
        const active = prev.find((p) => p.id === activeId);
        const over = prev.find((p) => p.id === overId);
        if (!active || !over || active.id === over.id) return prev;

        const updated = movePieceToPosition(prev, activeId, over.currentPosition);
        if (isPuzzleComplete(updated)) {
          setPhase('victory');
        }
        return updated;
      });

      setStats((prev) => ({ ...prev, moves: prev.moves + 1 }));
      setActiveHint(null);
    },
    [phase, isComplete],
  );

  const toggleGhostMode = useCallback(() => {
    setGhostMode((prev) => !prev);
  }, []);

  const useHint = useCallback(() => {
    if (phase !== 'playing' || hintsRemaining <= 0) return;

    setPieces((prev) => {
      const hint = findHintTarget(prev);
      if (!hint) return prev;

      setActiveHint(hint);
      const updated = applyHint(prev, hint);
      if (isPuzzleComplete(updated)) {
        setPhase('victory');
      }
      return updated;
    });

    setStats((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  }, [phase, hintsRemaining]);

  const playAgain = useCallback(() => {
    if (!config) return;
    const newPieces = shufflePieces(createPieces(config.gridSize));
    setPieces(newPieces);
    setStats({ moves: 0, hintsUsed: 0, startTime: Date.now() });
    setActiveHint(null);
    setPhase('playing');
  }, [config]);

  const newPuzzle = useCallback(() => {
    setPhase('menu');
    setConfig(null);
    setPieces([]);
    setStats(initialStats);
    setGhostMode(false);
    setActiveHint(null);
  }, []);

  return {
    phase,
    config,
    pieces,
    stats,
    ghostMode,
    hintsRemaining,
    activeHint,
    isComplete,
    setImage,
    setGridSize,
    startGame,
    swapPieces,
    toggleGhostMode,
    useHint,
    playAgain,
    newPuzzle,
  };
}
