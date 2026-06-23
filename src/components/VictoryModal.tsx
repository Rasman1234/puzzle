import type { Achievement, Sticker } from '../data/content';
import type { EducationalDiscovery as EduDiscovery } from '../data/v4Content';
import type { MysteryReward } from '../lib/mysteryBox';
import { Confetti } from './Confetti';
import { EducationalDiscovery } from './EducationalDiscovery';
import { playClickSound, playSound } from '../lib/audio';
import { useEffect } from 'react';

interface VictoryModalProps {
  moves: number;
  elapsedSeconds: number;
  sticker: Sticker | null;
  isRareSticker: boolean;
  isNewSticker: boolean;
  newAchievements: Achievement[];
  starsEarned: number;
  xpEarned: number;
  avatarLevel: number;
  leveledUp: boolean;
  mysteryReward?: MysteryReward | null;
  funFact?: { title: string; fact: string } | null;
  educational?: EduDiscovery | null;
  packImageId?: string;
  onPlayAgain: () => void;
  onNewPuzzle: () => void;
}

export function VictoryModal({
  moves,
  elapsedSeconds,
  sticker,
  isRareSticker,
  isNewSticker,
  newAchievements,
  starsEarned,
  xpEarned,
  avatarLevel,
  leveledUp,
  mysteryReward,
  funFact,
  educational,
  packImageId,
  onPlayAgain,
  onNewPuzzle,
}: VictoryModalProps) {
  useEffect(() => {
    playSound('complete');
    if (sticker) playSound('sticker');
    if (newAchievements.length > 0) playSound('achievement');
  }, [sticker, newAchievements.length]);

  return (
    <div className="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <Confetti active />
      <div className="floating-stars" aria-hidden="true">
        <span className="star s1">⭐</span>
        <span className="star s2">🌟</span>
        <span className="star s3">✨</span>
        <span className="star s4">⭐</span>
        <span className="star s5">🌟</span>
      </div>

      <div className="victory-modal">
        <h2 id="victory-title" className="victory-title">
          🎉 Great Job!
        </h2>
        <p className="victory-message">You solved the puzzle!</p>
        <p className="victory-stats">
          {moves} moves · {formatTime(elapsedSeconds)} · ⭐ +{starsEarned} · ✨ +{xpEarned} XP
        </p>
        {leveledUp && (
          <p className="level-up-banner" role="status">🎊 Level {avatarLevel}! New unlocks!</p>
        )}

        {mysteryReward && (
          <div className="reward-card">
            <p className="reward-label">Mystery Box: {mysteryReward.label}</p>
            <span className="reward-emoji" aria-hidden="true">{mysteryReward.emoji}</span>
          </div>
        )}

        {funFact && (
          <EducationalDiscovery
            title={funFact.title}
            fact={funFact.fact}
            discovery={educational ?? null}
            packImageId={packImageId}
          />
        )}

        {sticker && (
          <div className={`reward-card ${isRareSticker ? 'rare-reward' : ''} ${isNewSticker ? 'new-sticker-pop' : ''}`}>
            <p className="reward-label">
              {isNewSticker ? 'New Sticker!' : 'Sticker Reward!'}
              {isRareSticker && ' ✨ Rare!'}
            </p>
            <span className="reward-emoji" aria-hidden="true">{sticker.emoji}</span>
            <span className="reward-name">{sticker.name}</span>
          </div>
        )}

        {newAchievements.length > 0 && (
          <div className="achievement-toasts" aria-live="polite">
            {newAchievements.map((a) => (
              <div key={a.id} className="achievement-toast">
                <span aria-hidden="true">{a.emoji}</span> Achievement Unlocked: {a.name}!
              </div>
            ))}
          </div>
        )}

        <div className="victory-actions">
          <button type="button" className="btn btn-primary" onClick={() => { playClickSound(); onPlayAgain(); }}>
            🔄 Play Again
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => { playClickSound(); onNewPuzzle(); }}>
            🧩 New Puzzle
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
