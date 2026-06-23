import { COLLECTION_CATEGORIES, getCollectionByCategory } from '../data/v4Content';
import { loadProgress } from '../lib/playerProgress';
import { AvatarDisplay } from './AvatarSelector';
import { getAvatarById } from '../data/content';

interface CollectionBookProps {
  onBack: () => void;
}

export function CollectionBook({ onBack }: CollectionBookProps) {
  const p = loadProgress();
  const avatar = p.avatarId ? getAvatarById(p.avatarId) : null;
  const unlocked = new Set(p.collectionUnlocked);

  const categories = COLLECTION_CATEGORIES.map((cat) => {
    const items = getCollectionByCategory(cat.id);
    const collected = items.filter((i) => unlocked.has(i.id)).length;
    return { ...cat, items, collected, total: items.length };
  });

  const totalCollected = categories.reduce((s, c) => s + c.collected, 0);
  const totalItems = categories.reduce((s, c) => s + c.total, 0);
  const overallPercent = totalItems > 0 ? Math.round((totalCollected / totalItems) * 100) : 0;

  return (
    <section className="panel collection-book" aria-labelledby="collection-heading">
      <AvatarDisplay size="large" showAccessories />
      <h2 id="collection-heading" className="title">📖 Collection Book</h2>
      {avatar && (
        <p className="panel-subtitle">{avatar.name}&apos;s collection — {overallPercent}% complete</p>
      )}

      <div className="progress-bar" role="progressbar" aria-valuenow={overallPercent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${overallPercent}%` }} />
      </div>

      {categories.map((cat) => {
        const percent = cat.total > 0 ? Math.round((cat.collected / cat.total) * 100) : 0;
        return (
          <div key={cat.id} className="collection-category">
            <h3 className="pack-category-title">
              {cat.emoji} {cat.name} — {cat.collected}/{cat.total} ({percent}%)
            </h3>
            <div className="collection-grid">
              {cat.items.map((item) => {
                const has = unlocked.has(item.id);
                return (
                  <div key={item.id} className={`collection-item ${has ? 'collected' : 'locked'}`}>
                    <span aria-hidden="true">{has ? item.emoji : '❓'}</span>
                    <span className="sticker-name">{has ? item.name : '???'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button type="button" className="btn btn-secondary panel-back" onClick={onBack}>
        ← Back
      </button>
    </section>
  );
}
