import type { DailyRewardResult } from '../lib/dailyReward';
import { playSound } from '../lib/audio';
import { useEffect } from 'react';

interface DailyRewardModalProps {
  reward: DailyRewardResult;
  onClaim: () => void;
}

export function DailyRewardModal({ reward, onClaim }: DailyRewardModalProps) {
  useEffect(() => {
    playSound('daily');
  }, []);

  return (
    <div className="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="daily-title">
      <div className="victory-modal daily-reward-modal">
        <h2 id="daily-title" className="victory-title">🎁 Daily Reward!</h2>
        <p className="victory-message">Welcome back! Here is your gift for today.</p>
        <div className="reward-card new-sticker-pop">
          {reward.type === 'sticker' && reward.stickerEmoji && (
            <span className="reward-emoji" aria-hidden="true">{reward.stickerEmoji}</span>
          )}
          {reward.type !== 'sticker' && (
            <span className="reward-emoji" aria-hidden="true">⭐</span>
          )}
          <p className="reward-label">{reward.message}</p>
          {reward.starsEarned > 0 && (
            <p className="reward-name">+{reward.starsEarned} Stars</p>
          )}
        </div>
        <button type="button" className="btn btn-primary" onClick={onClaim}>
          Yay! 🎉
        </button>
      </div>
    </div>
  );
}
