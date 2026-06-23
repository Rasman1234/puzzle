import { useState } from 'react';
import {
  ensureWeeklyChallenges,
  getWeeklyChallengeProgress,
  isWeeklyChallengeComplete,
  claimWeeklyChallenge,
} from '../lib/weeklyChallenges';
import { loadProgress } from '../lib/playerProgress';
import { AvatarDisplay } from './AvatarSelector';
import { playClickSound } from '../lib/audio';

interface WeeklyChallengesPanelProps {
  onBack: () => void;
}

export function WeeklyChallengesPanel({ onBack }: WeeklyChallengesPanelProps) {
  const [, setTick] = useState(0);
  const challenges = ensureWeeklyChallenges();
  const claimed = loadProgress().weeklyChallengesClaimed;

  return (
    <section className="panel weekly-challenges" aria-labelledby="weekly-heading">
      <AvatarDisplay size="large" showAccessories />
      <h2 id="weekly-heading" className="title">📅 Weekly Challenges</h2>
      <p className="panel-subtitle">Complete tasks this week for bonus rewards!</p>

      <div className="challenge-list">
        {challenges.map((c) => {
          const progress = getWeeklyChallengeProgress(c);
          const complete = isWeeklyChallengeComplete(c);
          const percent = Math.min(100, Math.round((progress / c.target) * 100));
          const isClaimed = claimed.includes(c.id);

          return (
            <div key={c.id} className={`challenge-card ${complete ? 'complete' : ''}`}>
              <div className="challenge-header">
                <span className="challenge-emoji" aria-hidden="true">{c.emoji}</span>
                <div>
                  <span className="challenge-title">{c.title}</span>
                  <span className="challenge-desc">{c.description}</span>
                </div>
              </div>
              <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-fill" style={{ width: `${percent}%` }} />
              </div>
              <p className="challenge-progress">{progress} / {c.target}</p>
              <p className="challenge-reward">Reward: {c.rewardLabel}</p>
              {complete && !isClaimed && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    playClickSound();
                    claimWeeklyChallenge(c.id);
                    setTick((t) => t + 1);
                  }}
                >
                  Claim Reward!
                </button>
              )}
              {isClaimed && <p className="claimed-badge">✓ Claimed!</p>}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn btn-secondary panel-back" onClick={() => { playClickSound(); onBack(); }}>
        ← Back
      </button>
    </section>
  );
}
