import { AVATARS, ACCESSORIES } from '../data/content';
import { getAvatarById } from '../data/content';
import { loadProgress, setAvatar, unlockAccessory, toggleAccessory } from '../lib/playerProgress';
import { getAvatarLevel } from '../lib/avatarLevels';
import { playClickSound } from '../lib/audio';

interface AvatarDisplayProps {
  size?: 'small' | 'large';
  showName?: boolean;
  showAccessories?: boolean;
}

export function AvatarDisplay({ size = 'small', showName = false, showAccessories = true }: AvatarDisplayProps) {
  const p = loadProgress();
  const avatar = p.avatarId ? getAvatarById(p.avatarId) : null;
  if (!avatar) return null;

  const accessories = showAccessories
    ? p.equippedAccessories
        .map((id) => ACCESSORIES.find((a) => a.id === id))
        .filter(Boolean)
    : [];

  return (
    <div className={`avatar-display ${size}`}>
      {accessories.length > 0 && (
        <span className="avatar-accessories" aria-hidden="true">
          {accessories.map((a) => a!.emoji).join('')}
        </span>
      )}
      <span className="avatar-emoji" aria-hidden="true">{avatar.emoji}</span>
      {showName && <span className="avatar-name">{avatar.name}</span>}
    </div>
  );
}

interface AvatarSelectorProps {
  onComplete: () => void;
  showAccessories?: boolean;
}

export function AvatarSelector({ onComplete, showAccessories = false }: AvatarSelectorProps) {
  const p = loadProgress();

  const selectAvatar = (id: string) => {
    playClickSound();
    setAvatar(id);
    if (!showAccessories) onComplete();
  };

  const buyAccessory = (id: string) => {
    playClickSound();
    if (unlockAccessory(id)) {
      toggleAccessory(id);
    }
  };

  if (!showAccessories && !p.avatarId) {
    return (
      <section className="panel avatar-selector" aria-labelledby="avatar-heading">
        <h2 id="avatar-heading" className="title">Pick Your Friend!</h2>
        <p className="panel-subtitle">Who will go on puzzle adventures with you?</p>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              type="button"
              className="avatar-btn"
              onClick={() => selectAvatar(a.id)}
              aria-label={`Choose ${a.name}`}
            >
              <span className="avatar-emoji" aria-hidden="true">{a.emoji}</span>
              <span className="avatar-name">{a.name}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (showAccessories) {
    const level = getAvatarLevel(p.avatarXP);
    return (
      <section className="panel accessory-shop" aria-labelledby="accessory-heading">
        <h2 id="accessory-heading" className="title">⭐ Star Shop</h2>
        <p className="panel-subtitle">Level {level} · {p.totalStars} stars</p>
        <AvatarDisplay size="large" showName showAccessories />
        <div className="accessory-grid">
          {ACCESSORIES.map((acc) => {
            const owned = p.unlockedAccessories.includes(acc.id);
            const equipped = p.equippedAccessories.includes(acc.id);
            return (
              <button
                key={acc.id}
                type="button"
                className={`accessory-btn ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`}
                onClick={() => {
                  playClickSound();
                  if (owned) toggleAccessory(acc.id);
                  else buyAccessory(acc.id);
                }}
                disabled={!owned && p.totalStars < acc.starCost}
                aria-label={`${acc.name}, costs ${acc.starCost} stars`}
              >
                <span aria-hidden="true">{acc.emoji}</span>
                <span>{acc.name}</span>
                <span className="accessory-cost">{owned ? (equipped ? 'On' : 'Wear') : `⭐ ${acc.starCost}`}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="btn btn-primary" onClick={onComplete}>
          Done
        </button>
      </section>
    );
  }

  return null;
}
