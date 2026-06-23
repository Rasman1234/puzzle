import { SEASONAL_EVENTS, EVENT_STICKERS } from '../data/v4Content';
import { loadProgress, saveProgress } from './playerProgress';

export function getActiveSeasonalEvent() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return SEASONAL_EVENTS.find((e) => {
    const start = e.startMonth * 100 + e.startDay;
    const end = e.endMonth * 100 + e.endDay;
    const current = month * 100 + day;
    if (start <= end) return current >= start && current <= end;
    return current >= start || current <= end;
  }) ?? null;
}

export function claimSeasonalReward(eventId: string): boolean {
  const p = loadProgress();
  if (p.seasonalClaims.includes(eventId)) return false;
  const event = SEASONAL_EVENTS.find((e) => e.id === eventId);
  if (!event) return false;

  p.seasonalClaims.push(eventId);
  const sticker = EVENT_STICKERS[event.exclusiveStickerId];
  if (sticker && !p.stickersCollected.includes(sticker.id)) {
    p.stickersCollected.push(sticker.id);
  }
  if (!p.unlockedAccessories.includes(event.exclusiveAccessoryId)) {
    p.unlockedAccessories.push(event.exclusiveAccessoryId);
  }
  p.totalStars += 15;
  saveProgress(p);
  return true;
}

export function isSeasonalRewardClaimed(eventId: string): boolean {
  return loadProgress().seasonalClaims.includes(eventId);
}
