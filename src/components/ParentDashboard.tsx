import { getParentInsights } from '../lib/playerProgress';
import { AudioSettings } from './AudioSettings';
import { CertificateGenerator } from './CertificateGenerator';
import { playClickSound } from '../lib/audio';

interface ParentDashboardProps {
  onBack: () => void;
}

function formatTime(seconds: number | null): string {
  if (seconds === null) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const stats = getParentInsights();

  return (
    <section className="panel parent-dashboard" aria-labelledby="parent-heading">
      <h2 id="parent-heading" className="title">👪 Parent Insights</h2>
      <p className="panel-subtitle">Progress saved on this device</p>

      <AudioSettings />

      <div className="learning-summary">
        <p>{stats.learningSummaryV3}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.totalPuzzles}</span>
          <span className="stat-label">Puzzles Solved</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.weeklyPuzzles}</span>
          <span className="stat-label">This Week</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">Lv {stats.avatarLevel}</span>
          <span className="stat-label">Avatar Level</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.topicsExplored}</span>
          <span className="stat-label">Topics Explored</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.collectionPercent}%</span>
          <span className="stat-label">Collection</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.favoriteCategory}</span>
          <span className="stat-label">Favorite Category</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.difficultyProgression}</span>
          <span className="stat-label">Difficulty</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.weeklyChallengesCompleted}</span>
          <span className="stat-label">Weekly Challenges</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatTime(stats.averageSessionDuration)}</span>
          <span className="stat-label">Avg Session</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">⭐ {stats.totalStars}</span>
          <span className="stat-label">Stars Earned</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {stats.achievementProgress.unlocked}/{stats.achievementProgress.total}
          </span>
          <span className="stat-label">Achievements</span>
        </div>
      </div>

      <CertificateGenerator />

      <button type="button" className="btn btn-secondary panel-back" onClick={() => { playClickSound(); onBack(); }}>
        ← Back
      </button>
    </section>
  );
}
