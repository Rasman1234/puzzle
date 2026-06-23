import { useState } from 'react';
import type { MysteryReward } from '../lib/mysteryBox';
import { playClickSound, playSound } from '../lib/audio';

interface MysteryBoxProps {
  reward: MysteryReward;
  onOpenComplete: () => void;
}

export function MysteryBox({ reward, onOpenComplete }: MysteryBoxProps) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    playClickSound();
    setOpened(true);
    playSound('sticker');
    setTimeout(onOpenComplete, 1200);
  };

  return (
    <div className="victory-overlay mystery-box-overlay" role="dialog" aria-modal="true" aria-labelledby="mystery-title">
      <div className={`mystery-box-modal ${opened ? 'opened' : ''}`}>
        <h2 id="mystery-title" className="victory-title">🎁 Mystery Box!</h2>
        {!opened ? (
          <>
            <button
              type="button"
              className="mystery-box-closed"
              onClick={handleOpen}
              aria-label="Open mystery box"
            >
              <span className="box-emoji" aria-hidden="true">🎁</span>
              <span>Tap to open!</span>
            </button>
          </>
        ) : (
          <div className="mystery-reveal new-sticker-pop">
            <span className="reward-emoji" aria-hidden="true">{reward.emoji}</span>
            <p className="reward-label">{reward.label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
