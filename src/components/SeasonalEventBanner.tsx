import { useState } from 'react';
import { getActiveSeasonalEvent, isSeasonalRewardClaimed, claimSeasonalReward } from '../lib/seasonalEvents';
import { playClickSound } from '../lib/audio';

export function SeasonalEventBanner() {
  const [, setTick] = useState(0);
  const event = getActiveSeasonalEvent();
  if (!event) return null;

  const claimed = isSeasonalRewardClaimed(event.id);

  return (
    <div className="seasonal-banner" role="status">
      <p className="seasonal-title">{event.emoji} {event.name} is here!</p>
      <p className="seasonal-desc">{event.challengeLabel}</p>
      {!claimed && (
        <button
          type="button"
          className="btn btn-primary seasonal-claim"
          onClick={() => {
            playClickSound();
            claimSeasonalReward(event.id);
            setTick((t) => t + 1);
          }}
        >
          Claim Event Reward!
        </button>
      )}
      {claimed && <p className="claimed-badge">✓ Event reward collected!</p>}
    </div>
  );
}
