import { describe, it, expect } from 'vitest';
import { cn, extractKeyFromUrl } from '@/lib/utils';

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('should handle object notation', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });
});

describe('extractKeyFromUrl', () => {
  it('should extract key from uploadthing URL', () => {
    const url = 'https://uploadthing.com/f/abc123_test-key';
    expect(extractKeyFromUrl(url)).toBe('abc123_test-key');
  });

  it('should extract key from URL with path segments', () => {
    const url = 'https://utfs.io/f/myKey123/file.jpg';
    expect(extractKeyFromUrl(url)).toBe('myKey123');
  });

  it('should return empty string for URL without key pattern', () => {
    const url = 'https://example.com/image.jpg';
    expect(extractKeyFromUrl(url)).toBe('');
  });

  it('should handle URL with dashes in key', () => {
    const url = 'https://utfs.io/f/my-key-123';
    expect(extractKeyFromUrl(url)).toBe('my-key-123');
  });

  it('should handle URL with underscores in key', () => {
    const url = 'https://utfs.io/f/my_key_123';
    expect(extractKeyFromUrl(url)).toBe('my_key_123');
  });

  it('should return empty string for empty URL', () => {
    expect(extractKeyFromUrl('')).toBe('');
  });
});
