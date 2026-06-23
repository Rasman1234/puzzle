interface GameControlsProps {
  ghostMode: boolean;
  hintsRemaining: number;
  moves: number;
  elapsedSeconds: number;
  onToggleGhost: () => void;
  onHint: () => void;
  onNewPuzzle: () => void;
}

export function GameControls({
  ghostMode,
  hintsRemaining,
  moves,
  elapsedSeconds,
  onToggleGhost,
  onHint,
  onNewPuzzle,
}: GameControlsProps) {
  return (
    <div className="game-controls" role="toolbar" aria-label="Game controls">
      <button
        type="button"
        className={`btn control-btn ${ghostMode ? 'active' : ''}`}
        onClick={onToggleGhost}
        aria-pressed={ghostMode}
        aria-label="Toggle ghost image hint"
      >
        👻 Ghost {ghostMode ? 'On' : 'Off'}
      </button>

      <button
        type="button"
        className="btn control-btn"
        onClick={onHint}
        disabled={hintsRemaining <= 0}
        aria-label={`Get a hint, ${hintsRemaining} remaining`}
      >
        💡 Hint ({hintsRemaining})
      </button>

      <span className="moves-counter" aria-live="polite">
        Moves: {moves} · {formatTime(elapsedSeconds)}
      </span>

      <button
        type="button"
        className="btn control-btn"
        onClick={onNewPuzzle}
        aria-label="Start a new puzzle"
      >
        🆕 New
      </button>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
