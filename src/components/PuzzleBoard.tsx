import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { GridSize, PuzzlePieceData } from '../types/puzzle';
import type { HintResult } from '../lib/hints';
import { findPieceAt, getBackgroundStyle } from '../lib/puzzleGenerator';
import { PuzzlePiece } from './PuzzlePiece';

interface PuzzleBoardProps {
  pieces: PuzzlePieceData[];
  imageUrl: string;
  gridSize: GridSize;
  ghostMode: boolean;
  activeHint: HintResult | null;
  disabled?: boolean;
  onSwap: (activeId: string, overId: string) => void;
}

export function PuzzleBoard({
  pieces,
  imageUrl,
  gridSize,
  ghostMode,
  activeHint,
  disabled = false,
  onSwap,
}: PuzzleBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  );

  const activePiece = activeId ? pieces.find((p) => p.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;
    onSwap(String(active.id), String(over.id));
  };

  const cells = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = findPieceAt(pieces, { row, col });
      const isHintTarget =
        activeHint &&
        activeHint.correctPosition.row === row &&
        activeHint.correctPosition.col === col;

      cells.push(
        <div
          key={`${row}-${col}`}
          className={`board-cell ${isHintTarget ? 'hint-target' : ''}`}
        >
          {piece && (
            <PuzzlePiece
              piece={piece}
              imageUrl={imageUrl}
              gridSize={gridSize}
              isHinted={activeHint?.pieceId === piece.id}
              disabled={disabled}
            />
          )}
        </div>,
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="puzzle-board-wrapper"
        style={{ '--grid-size': gridSize } as React.CSSProperties}
      >
        {ghostMode && (
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="ghost-image"
          />
        )}
        <div
          className="puzzle-board"
          role="grid"
          aria-label={`${gridSize} by ${gridSize} puzzle board`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {cells}
        </div>
      </div>

      <DragOverlay>
        {activePiece ? (
          <div
            className="puzzle-piece drag-overlay"
            style={getBackgroundStyle(imageUrl, gridSize, activePiece.correctPosition)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
