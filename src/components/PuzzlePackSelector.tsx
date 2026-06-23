import { PUZZLE_PACKS } from '../data/content';
import { playClickSound } from '../lib/audio';

interface PuzzlePackSelectorProps {
  onSelectImage: (
    url: string,
    width: number,
    height: number,
    meta: { packImageId: string; categoryId: string },
  ) => void;
}

export function PuzzlePackSelector({ onSelectImage }: PuzzlePackSelectorProps) {
  return (
    <section className="pack-selector" aria-labelledby="pack-heading">
      <h2 id="pack-heading" className="title">📦 Puzzle Packs</h2>
      <p className="subtitle">Pick a picture — no upload needed!</p>

      {PUZZLE_PACKS.map((pack) => (
        <div key={pack.id} className="pack-category">
          <h3 className="pack-category-title">
            {pack.emoji} {pack.name}
          </h3>
          <div className="pack-images" role="list">
            {pack.images.map((img) => (
              <button
                key={img.id}
                type="button"
                className="pack-image-btn"
                onClick={() => {
                  playClickSound();
                  onSelectImage(img.path, img.width, img.height, {
                    packImageId: img.id,
                    categoryId: pack.id,
                  });
                }}
                aria-label={`Play ${img.name} puzzle from ${pack.name}`}
                role="listitem"
              >
                <img src={img.path} alt={img.name} className="pack-thumb" />
                <span className="pack-image-name">{img.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
