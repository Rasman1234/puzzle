import { loadProgress } from '../lib/playerProgress';
import { getAvatarById } from '../data/content';
import { getAvatarLevel } from '../lib/avatarLevels';
import { isDailyRewardAvailable } from '../lib/dailyReward';
import { AvatarDisplay } from './AvatarSelector';
import { playClickSound } from '../lib/audio';

interface WelcomeBackScreenProps {
  onContinue: () => void;
  onOpenShop: () => void;
  onOpenWeekly: () => void;
}

export function WelcomeBackScreen({ onContinue, onOpenShop, onOpenWeekly }: WelcomeBackScreenProps) {
  const p = loadProgress();
  const avatar = p.avatarId ? getAvatarById(p.avatarId) : null;
  const level = getAvatarLevel(p.avatarXP);
  const dailyAvailable = isDailyRewardAvailable();

  return (
    <section className="welcome-back" aria-labelledby="welcome-heading">
      <AvatarDisplay size="large" showAccessories />
      <h1 id="welcome-heading" className="title">
        Welcome back {avatar?.name ?? 'friend'}!
      </h1>
      <p className="panel-subtitle">Level {level} Puzzle Explorer</p>

      <div className="welcome-stats">
        <div className="welcome-stat">⭐ {p.totalStars} Stars</div>
        <div className="welcome-stat">🏆 {p.achievementsUnlocked.length} Achievements</div>
        <div className="welcome-stat">🎨 {p.stickersCollected.length} Stickers</div>
      </div>

      {dailyAvailable && (
        <p className="daily-available">🎁 Daily Reward Available!</p>
      )}

      <div className="welcome-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { playClickSound(); onContinue(); }}
        >
          ▶️ Continue Playing
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => { playClickSound(); onOpenWeekly(); }}
        >
          📅 Weekly Challenges
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => { playClickSound(); onOpenShop(); }}
        >
          ⭐ Star Shop
        </button>
      </div>
    </section>
  );
}
