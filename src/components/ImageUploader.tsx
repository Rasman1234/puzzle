import { useRef, useState } from 'react';
import { loadAndPrepareImage, validateImageFile, getFriendlyLoadError } from '../lib/imageValidation';

interface ImageUploaderProps {
  onImageReady: (url: string, width: number, height: number) => void;
  embedded?: boolean;
}

export function ImageUploader({ onImageReady, embedded = false }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setMessage(validation.friendlyMessage ?? 'Try another picture!');
      return;
    }

    setLoading(true);
    try {
      const { url, width, height } = await loadAndPrepareImage(file);
      setPreview(url);
      onImageReady(url, width, height);
    } catch (error) {
      console.error('Image load failed:', error);
      setMessage(getFriendlyLoadError(error));
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <section className="uploader" aria-labelledby={embedded ? undefined : 'upload-heading'}>
      {!embedded && (
        <>
          <h1 id="upload-heading" className="title">
            🧩 Puzzle Time!
          </h1>
          <p className="subtitle">Pick a picture to turn into a puzzle</p>
        </>
      )}

      <button
        type="button"
        className="btn btn-primary upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        aria-label="Choose a picture"
      >
        {loading ? '⏳ Loading...' : '📷 Choose a Picture'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onInputChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div
        className="drop-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        role="presentation"
      >
        {preview ? (
          <img src={preview} alt="Your puzzle picture" className="preview-image" />
        ) : (
          <span className="drop-hint">or drag a picture here</span>
        )}
      </div>

      {message && (
        <p className="friendly-message" role="alert">
          {message}
        </p>
      )}
    </section>
  );
}
