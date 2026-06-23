import { STICKERS } from '../data/content';
import { getCollectedStickers, loadProgress } from '../lib/playerProgress';
import { AvatarDisplay } from './AvatarSelector';
import { getAvatarById } from '../data/content';

interface StickerGalleryProps {
  onBack: () => void;
}

export function StickerGallery({ onBack }: StickerGalleryProps) {
  const collected = getCollectedStickers();
  const total = STICKERS.length;
  const percent = Math.round((collected.length / total) * 100);
  const p = loadProgress();
  const avatar = p.avatarId ? getAvatarById(p.avatarId) : null;

  return (
    <section className="panel sticker-gallery" aria-labelledby="sticker-heading">
      <AvatarDisplay size="large" showAccessories />
      <h2 id="sticker-heading" className="title">🏆 Sticker Book</h2>
      {avatar && (
        <p className="panel-subtitle">{avatar.name} collected {collected.length} stickers!</p>
      )}
      <p className="panel-subtitle">
        {collected.length} of {total} collected ({percent}%)
      </p>

      <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="sticker-grid">
        {STICKERS.map((sticker) => {
          const has = collected.includes(sticker.id);
          return (
            <div
              key={sticker.id}
              className={`sticker-card ${has ? 'collected' : 'locked'} ${sticker.rare ? 'rare' : ''}`}
              aria-label={has ? `${sticker.name} sticker collected` : `${sticker.name} sticker not yet collected`}
            >
              <span className="sticker-emoji" aria-hidden="true">
                {has ? sticker.emoji : '❓'}
              </span>
              <span className="sticker-name">{has ? sticker.name : '???'}</span>
              {sticker.rare && <span className="rare-badge">✨ Rare</span>}
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
