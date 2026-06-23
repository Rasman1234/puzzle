import { useEffect, useRef, useState } from 'react';
import { usePuzzleGame } from './hooks/usePuzzleGame';
import { ImageUploader } from './components/ImageUploader';
import { DifficultyPicker } from './components/DifficultyPicker';
import { PuzzleBoard } from './components/PuzzleBoard';
import { GameControls } from './components/GameControls';
import { VictoryModal } from './components/VictoryModal';
import { MysteryBox } from './components/MysteryBox';
import { PuzzlePackSelector } from './components/PuzzlePackSelector';
import { CollectionBook } from './components/CollectionBook';
import { AchievementsPanel } from './components/AchievementsPanel';
import { ParentDashboard } from './components/ParentDashboard';
import { AvatarSelector } from './components/AvatarSelector';
import { WelcomeBackScreen } from './components/WelcomeBackScreen';
import { DailyRewardModal } from './components/DailyRewardModal';
import { WeeklyChallengesPanel } from './components/WeeklyChallengesPanel';
import { SeasonalEventBanner } from './components/SeasonalEventBanner';
import { AudioSettings } from './components/AudioSettings';
import {
  recordPuzzleComplete,
  recordVisit,
  recordSessionEnd,
  loadProgress,
  isReturningPlayer,
  type VictoryResult,
} from './lib/playerProgress';
import { getFunFactForImageId } from './data/content';
import { getEducationalDiscovery } from './data/v4Content';
import { isDailyRewardAvailable, claimDailyReward, type DailyRewardResult } from './lib/dailyReward';
import { openMysteryBox, type MysteryReward } from './lib/mysteryBox';
import { playClickSound } from './lib/audio';

type AppView = 'game' | 'collection' | 'achievements' | 'parent' | 'shop' | 'weekly';
type StartMode = 'picture' | 'packs';
type BootPhase = 'avatar' | 'welcome' | 'daily' | 'ready';

export default function App() {
  const game = usePuzzleGame();
  const [now, setNow] = useState(Date.now());
  const [appView, setAppView] = useState<AppView>('game');
  const [startMode, setStartMode] = useState<StartMode>('picture');
  const [bootPhase, setBootPhase] = useState<BootPhase>('ready');
  const [victoryResult, setVictoryResult] = useState<VictoryResult | null>(null);
  const [mysteryReward, setMysteryReward] = useState<MysteryReward | null>(null);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [dailyReward, setDailyReward] = useState<DailyRewardResult | null>(null);
  const victoryRecorded = useRef(false);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    recordVisit();

    const p = loadProgress();
    if (!p.avatarId) {
      setBootPhase('avatar');
    } else if (isReturningPlayer()) {
      setBootPhase('welcome');
    } else {
      setBootPhase('ready');
    }

    return () => recordSessionEnd();
  }, []);

  useEffect(() => {
    if (game.phase !== 'playing') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [game.phase]);

  const elapsedSeconds =
    game.stats.startTime > 0
      ? Math.floor((now - game.stats.startTime) / 1000)
      : 0;

  useEffect(() => {
    if (game.phase === 'victory' && game.config && !victoryRecorded.current) {
      victoryRecorded.current = true;
      const result = recordPuzzleComplete({
        hintsUsed: game.stats.hintsUsed,
        elapsedSeconds,
        gridSize: game.config.gridSize,
        categoryId: game.config.categoryId,
        packImageId: game.config.packImageId,
      });
      setVictoryResult(result);
      const mystery = openMysteryBox();
      setMysteryReward(mystery);
      setShowMysteryBox(true);
    }
    if (game.phase !== 'victory') {
      victoryRecorded.current = false;
      setVictoryResult(null);
      setMysteryReward(null);
      setShowMysteryBox(false);
    }
  }, [game.phase, game.config, game.stats.hintsUsed, elapsedSeconds]);

  const handleWelcomeContinue = () => {
    if (isDailyRewardAvailable()) {
      setDailyReward(claimDailyReward());
      setBootPhase('daily');
    } else {
      setBootPhase('ready');
    }
  };

  const handleDailyClaim = () => {
    setDailyReward(null);
    setBootPhase('ready');
  };

  const handlePackSelect = (
    url: string,
    w: number,
    h: number,
    meta: { packImageId: string; categoryId: string },
  ) => {
    game.setImage(url, w, h, meta);
  };

  const showNav = game.phase === 'menu' && appView === 'game' && bootPhase === 'ready';
  const progress = loadProgress();
  const packImageId = game.config?.packImageId;
  const funFact = packImageId ? getFunFactForImageId(packImageId) : null;
  const educational = packImageId ? getEducationalDiscovery(packImageId) : null;

  if (bootPhase === 'avatar') {
    return (
      <main className="app">
        <AvatarSelector onComplete={() => setBootPhase(isReturningPlayer() ? 'welcome' : 'ready')} />
      </main>
    );
  }

  if (bootPhase === 'welcome') {
    return (
      <main className="app">
        <WelcomeBackScreen
          onContinue={handleWelcomeContinue}
          onOpenShop={() => {
            setBootPhase('ready');
            setAppView('shop');
          }}
          onOpenWeekly={() => {
            setBootPhase('ready');
            setAppView('weekly');
          }}
        />
      </main>
    );
  }

  if (bootPhase === 'daily' && dailyReward) {
    return (
      <main className="app">
        <DailyRewardModal reward={dailyReward} onClaim={handleDailyClaim} />
      </main>
    );
  }

  if (appView === 'collection') {
    return (
      <main className="app">
        <CollectionBook onBack={() => setAppView('game')} />
      </main>
    );
  }

  if (appView === 'weekly') {
    return (
      <main className="app">
        <WeeklyChallengesPanel onBack={() => setAppView('game')} />
      </main>
    );
  }

  if (appView === 'achievements') {
    return (
      <main className="app">
        <AchievementsPanel onBack={() => setAppView('game')} />
      </main>
    );
  }

  if (appView === 'parent') {
    return (
      <main className="app">
        <ParentDashboard onBack={() => setAppView('game')} />
      </main>
    );
  }

  if (appView === 'shop') {
    return (
      <main className="app">
        <AvatarSelector showAccessories onComplete={() => setAppView('game')} />
      </main>
    );
  }

  return (
    <main className="app">
      <header className="app-header">
        <span className="logo" aria-hidden="true">🧩</span>
        <span className="app-name">Kids Puzzle</span>
        <span className="header-stars" aria-label={`${progress.totalStars} stars`}>⭐ {progress.totalStars}</span>
        {showNav && (
          <nav className="header-nav" aria-label="Collection and stats">
            <button type="button" className="btn nav-btn" onClick={() => { playClickSound(); setAppView('collection'); }}>
              📖 Collection
            </button>
            <button type="button" className="btn nav-btn" onClick={() => { playClickSound(); setAppView('weekly'); }}>
              📅 Weekly
            </button>
            <button type="button" className="btn nav-btn" onClick={() => { playClickSound(); setAppView('achievements'); }}>
              🎖️ Badges
            </button>
            <button type="button" className="btn nav-btn" onClick={() => { playClickSound(); setAppView('shop'); }}>
              ⭐ Shop
            </button>
            <button type="button" className="btn nav-btn" onClick={() => { playClickSound(); setAppView('parent'); }}>
              👪 Parents
            </button>
            <AudioSettings />
          </nav>
        )}
      </header>

      {game.phase === 'menu' && (
        <section className="start-screen" aria-labelledby="start-heading">
          <SeasonalEventBanner />
          <h1 id="start-heading" className="title">🧩 Puzzle Time!</h1>

          <div className="start-mode-toggle" role="tablist" aria-label="How to start">
            <button
              type="button"
              role="tab"
              aria-selected={startMode === 'picture'}
              className={`btn mode-btn ${startMode === 'picture' ? 'selected' : ''}`}
              onClick={() => { playClickSound(); setStartMode('picture'); }}
            >
              📷 My Picture
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={startMode === 'packs'}
              className={`btn mode-btn ${startMode === 'packs' ? 'selected' : ''}`}
              onClick={() => { playClickSound(); setStartMode('packs'); }}
            >
              📦 Puzzle Packs
            </button>
          </div>

          {startMode === 'picture' ? (
            <ImageUploader onImageReady={(url, w, h) => game.setImage(url, w, h)} embedded />
          ) : (
            <PuzzlePackSelector onSelectImage={handlePackSelect} />
          )}
        </section>
      )}

      {game.phase === 'setup' && game.config && (
        <DifficultyPicker
          selected={game.config.gridSize}
          onSelect={game.setGridSize}
          onStart={game.startGame}
          previewUrl={game.config.imageUrl}
        />
      )}

      {(game.phase === 'playing' || game.phase === 'victory') && game.config && (
        <section className="game-area" aria-label="Puzzle game">
          <GameControls
            ghostMode={game.ghostMode}
            hintsRemaining={game.hintsRemaining}
            moves={game.stats.moves}
            elapsedSeconds={elapsedSeconds}
            onToggleGhost={game.toggleGhostMode}
            onHint={game.useHint}
            onNewPuzzle={game.newPuzzle}
          />

          <PuzzleBoard
            pieces={game.pieces}
            imageUrl={game.config.imageUrl}
            gridSize={game.config.gridSize}
            ghostMode={game.ghostMode}
            activeHint={game.activeHint}
            disabled={game.phase === 'victory'}
            onSwap={game.swapPieces}
          />
        </section>
      )}

      {game.phase === 'victory' && showMysteryBox && mysteryReward && (
        <MysteryBox reward={mysteryReward} onOpenComplete={() => setShowMysteryBox(false)} />
      )}

      {game.phase === 'victory' && victoryResult && !showMysteryBox && (
        <VictoryModal
          moves={game.stats.moves}
          elapsedSeconds={elapsedSeconds}
          sticker={victoryResult.sticker}
          isRareSticker={victoryResult.isRare}
          isNewSticker={victoryResult.isNewSticker}
          newAchievements={victoryResult.newAchievements}
          starsEarned={victoryResult.starsEarned}
          xpEarned={victoryResult.xpEarned}
          avatarLevel={victoryResult.avatarLevel}
          leveledUp={victoryResult.leveledUp}
          mysteryReward={mysteryReward}
          funFact={funFact}
          educational={educational}
          packImageId={packImageId}
          onPlayAgain={game.playAgain}
          onNewPuzzle={game.newPuzzle}
        />
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {game.phase === 'victory' ? 'Puzzle complete! Great job!' : ''}
      </div>
    </main>
  );
}
