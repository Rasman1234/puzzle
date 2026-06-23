import { describe, it, expect } from 'vitest';
import { validateImageFile } from './imageValidation';

describe('validateImageFile', () => {
  it('accepts valid JPEG', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    expect(validateImageFile(file).valid).toBe(true);
  });

  it('accepts valid PNG', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 });
    expect(validateImageFile(file).valid).toBe(true);
  });

  it('rejects unsupported type', () => {
    const file = new File([''], 'test.gif', { type: 'image/gif' });
    Object.defineProperty(file, 'size', { value: 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.friendlyMessage).toBeTruthy();
  });

  it('rejects oversized file', () => {
    const file = new File([''], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.friendlyMessage).toContain('too big');
  });
});
