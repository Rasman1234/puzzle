import { isSoundEnabled, setSoundEnabled, playClickSound } from '../lib/audio';

export function AudioSettings() {
  const enabled = isSoundEnabled();

  const toggle = () => {
    setSoundEnabled(!enabled);
    if (!enabled) playClickSound();
  };

  return (
    <button
      type="button"
      className={`btn audio-settings ${enabled ? 'active' : ''}`}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
    >
      {enabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
    </button>
  );
}
