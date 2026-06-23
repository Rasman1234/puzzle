import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { GridSize, PuzzlePieceData } from '../types/puzzle';
import { getBackgroundStyle } from '../lib/puzzleGenerator';

interface PuzzlePieceProps {
  piece: PuzzlePieceData;
  imageUrl: string;
  gridSize: GridSize;
  isHinted: boolean;
  disabled?: boolean;
}

export function PuzzlePiece({
  piece,
  imageUrl,
  gridSize,
  isHinted,
  disabled = false,
}: PuzzlePieceProps) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({
    id: piece.id,
    disabled,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: piece.id,
    disabled,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  const style = {
    ...getBackgroundStyle(imageUrl, gridSize, piece.correctPosition),
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`puzzle-piece ${isDragging ? 'dragging' : ''} ${isHinted ? 'hinted' : ''} ${isOver ? 'drop-over' : ''}`}
      style={style}
      {...listeners}
      {...attributes}
      role="button"
      aria-label={`Puzzle piece row ${piece.correctPosition.row + 1}, column ${piece.correctPosition.col + 1}`}
      tabIndex={disabled ? -1 : 0}
    />
  );
}
