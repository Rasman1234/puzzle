import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { resetProgress } from './lib/playerProgress';

describe('App', () => {
  it('renders avatar selection for new players', () => {
    resetProgress();
    render(<App />);
    expect(screen.getByText(/Pick Your Friend/i)).toBeInTheDocument();
  });
});
