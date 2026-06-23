import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MIN_IMAGE_DIMENSION,
  MAX_IMAGE_DIMENSION,
} from '../types/puzzle';

export interface ImageValidationResult {
  valid: boolean;
  friendlyMessage?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      friendlyMessage: 'Try a photo file (JPG, PNG, or WebP)!',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      friendlyMessage: 'That picture is too big. Try a smaller one!',
    };
  }

  return { valid: true };
}

export function loadAndPrepareImage(file: File): Promise<{
  url: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();

      img.onload = () => {
        if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
          reject(new Error('too_small'));
          return;
        }

        const { url, width, height } = downscaleImage(img);
        resolve({ url, width, height });
      };

      img.onerror = () => reject(new Error('load_failed'));
      img.src = dataUrl;
    };

    reader.onerror = () => reject(new Error('read_failed'));
    reader.readAsDataURL(file);
  });
}

function downscaleImage(img: HTMLImageElement): {
  url: string;
  width: number;
  height: number;
} {
  let { width, height } = img;

  if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { url: img.src, width, height };
    }
    ctx.drawImage(img, 0, 0);
    return { url: canvas.toDataURL('image/jpeg', 0.92), width, height };
  }

  const scale = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { url: img.src, width: img.width, height: img.height };
  }
  ctx.drawImage(img, 0, 0, width, height);
  return { url: canvas.toDataURL('image/jpeg', 0.92), width, height };
}

export function getFriendlyLoadError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'too_small') {
      return 'That picture is too small. Try a bigger one!';
    }
  }
  return 'Could not use that picture. Try another one!';
}
