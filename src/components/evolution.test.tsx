import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StickerGallery } from './StickerGallery';
import { AchievementsPanel } from './AchievementsPanel';
import { ParentDashboard } from './ParentDashboard';
import { PuzzlePackSelector } from './PuzzlePackSelector';
import { resetProgress, loadProgress, saveProgress } from '../lib/playerProgress';

describe('StickerGallery', () => {
  beforeEach(() => {
    resetProgress();
    const p = loadProgress();
    p.stickersCollected = ['puppy'];
    p.puzzlesCompleted = 1;
    saveProgress(p);
  });

  it('shows collection progress', () => {
    render(<StickerGallery onBack={vi.fn()} />);
    expect(screen.getByText(/Sticker Book/i)).toBeInTheDocument();
    expect(screen.getByText(/collected/i)).toBeInTheDocument();
  });

  it('calls onBack', () => {
    const onBack = vi.fn();
    render(<StickerGallery onBack={onBack} />);
    fireEvent.click(screen.getByText(/Back/i));
    expect(onBack).toHaveBeenCalled();
  });
});

describe('AchievementsPanel', () => {
  beforeEach(() => resetProgress());

  it('renders achievements list', () => {
    render(<AchievementsPanel onBack={vi.fn()} />);
    expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
    expect(screen.getByText('First Puzzle')).toBeInTheDocument();
  });
});

describe('ParentDashboard', () => {
  beforeEach(() => {
    resetProgress();
    const p = loadProgress();
    p.puzzlesCompleted = 1;
    p.totalHintsUsed = 1;
    p.solveTimes = [60];
    p.difficultyCounts = { '3': 1 };
    p.fastestSolve = 60;
    p.stickersCollected = ['puppy', 'lion', 'fish'];
    p.achievementsUnlocked = ['first-puzzle'];
    saveProgress(p);
  });

  it('shows parent stats', () => {
    render(<ParentDashboard onBack={vi.fn()} />);
    expect(screen.getByText(/Parent Insights/i)).toBeInTheDocument();
    expect(screen.getByText('Puzzles Solved')).toBeInTheDocument();
    const statCards = document.querySelectorAll('.stat-value');
    expect(statCards[0]?.textContent).toBe('1');
  });
});

describe('PuzzlePackSelector', () => {
  it('renders all pack categories', () => {
    const onSelect = vi.fn();
    render(<PuzzlePackSelector onSelectImage={onSelect} />);
    expect(screen.getByRole('heading', { name: /Animals/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Dinosaurs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Space/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Ocean/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cars/i })).toBeInTheDocument();
  });

  it('calls onSelectImage when pack image clicked', () => {
    const onSelect = vi.fn();
    render(<PuzzlePackSelector onSelectImage={onSelect} />);
    fireEvent.click(screen.getByLabelText(/Play Puppy puzzle/i));
    expect(onSelect).toHaveBeenCalledWith('/packs/animals/puppy.svg', 400, 400, {
      packImageId: 'puppy-pack',
      categoryId: 'animals',
    });
  });
});
