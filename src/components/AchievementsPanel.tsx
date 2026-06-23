import { ACHIEVEMENTS } from '../data/content';
import { getUnlockedAchievements, loadProgress } from '../lib/playerProgress';
import { AvatarDisplay } from './AvatarSelector';
import { getAvatarById } from '../data/content';

interface AchievementsPanelProps {
  onBack: () => void;
}

export function AchievementsPanel({ onBack }: AchievementsPanelProps) {
  const unlocked = getUnlockedAchievements();
  const p = loadProgress();
  const avatar = p.avatarId ? getAvatarById(p.avatarId) : null;

  return (
    <section className="panel achievements-panel" aria-labelledby="achievements-heading">
      <AvatarDisplay size="large" showAccessories />
      <h2 id="achievements-heading" className="title">🎖️ Achievements</h2>
      {avatar && (
        <p className="panel-subtitle">{avatar.name} has {unlocked.length} badges!</p>
      )}
      <p className="panel-subtitle">
        {unlocked.length} of {ACHIEVEMENTS.length} unlocked
      </p>

      <div className="achievement-list">
        {ACHIEVEMENTS.map((a) => {
          const has = unlocked.includes(a.id);
          return (
            <div key={a.id} className={`achievement-card ${has ? 'unlocked' : 'locked'}`}>
              <span className="achievement-emoji" aria-hidden="true">
                {has ? a.emoji : '🔒'}
              </span>
              <div className="achievement-info">
                <span className="achievement-name">{a.name}</span>
                <span className="achievement-desc">{a.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button type="button" className="btn btn-secondary panel-back" onClick={onBack}>
        ← Back
      </button>
    </section>
  );
}
