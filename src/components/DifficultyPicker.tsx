import type { GridSize } from '../types/puzzle';
import { GRID_SIZES } from '../types/puzzle';
import { DIFFICULTY_LABELS, STAR_REWARDS } from '../data/content';
import { loadProgress } from '../lib/playerProgress';
import { getDifficultyRecommendation } from '../lib/difficultyCoach';
import { playClickSound } from '../lib/audio';

interface DifficultyPickerProps {
  selected: GridSize;
  onSelect: (size: GridSize) => void;
  onStart: () => void;
  previewUrl: string;
}

export function DifficultyPicker({
  selected,
  onSelect,
  onStart,
  previewUrl,
}: DifficultyPickerProps) {
  const coach = getDifficultyRecommendation(loadProgress());

  return (
    <section className="difficulty" aria-labelledby="difficulty-heading">
      <h2 id="difficulty-heading" className="title">
        Pick your challenge!
      </h2>

      <img src={previewUrl} alt="Your picture" className="setup-preview" />

      {coach.type !== 'none' && (
        <div className="coach-banner" role="status">
          <p>{coach.message}</p>
          {coach.suggestedSize && (
            <button
              type="button"
              className="btn coach-btn"
              onClick={() => {
                playClickSound();
                onSelect(coach.suggestedSize!);
              }}
            >
              Try it!
            </button>
          )}
        </div>
      )}

      <div className="size-grid" role="group" aria-label="Puzzle difficulty">
        {GRID_SIZES.map((size) => {
          const { emoji, label } = DIFFICULTY_LABELS[size];
          const stars = STAR_REWARDS[size];
          return (
            <button
              key={size}
              type="button"
              className={`btn size-btn ${selected === size ? 'selected' : ''}`}
              onClick={() => { playClickSound(); onSelect(size); }}
              aria-pressed={selected === size}
              aria-label={`${label} difficulty, ${size} by ${size} pieces, ${stars} stars`}
            >
              <span className="size-emoji">{emoji}</span>
              <span className="size-label">{label}</span>
              <span className="size-number">{size}×{size}</span>
              <span className="size-stars">⭐ {stars}</span>
            </button>
          );
        })}
      </div>

      <button type="button" className="btn btn-primary start-btn" onClick={() => { playClickSound(); onStart(); }}>
        ▶️ Start Puzzle!
      </button>
    </section>
  );
}
