import type { CharacterSpan } from './types.js';

/**
 * Default character set for shuffle animation
 */
export const DEFAULT_SHUFFLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

/**
 * Splits text into individual character spans for animation
 */
export function splitTextToSpans(
  element: HTMLElement,
  text: string
): CharacterSpan[] {
  // Clear existing content
  element.innerHTML = '';

  const spans: CharacterSpan[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement('span') as CharacterSpan;

    // Store original character and index
    span.originalChar = char;
    span.charIndex = i;
    span.textContent = char;

    // Add class for styling if needed
    span.classList.add('gsap-char');

    // Preserve spaces with non-breaking space for layout
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
      span.classList.add('gsap-space');
    }

    element.appendChild(span);
    spans.push(span);
  }

  return spans;
}

/**
 * Gets a random character from the provided character set
 */
export function getRandomCharacter(
  charset: string = DEFAULT_SHUFFLE_CHARS
): string {
  return charset[Math.floor(Math.random() * charset.length)];
}

/**
 * Checks if user prefers reduced motion
 */
export function shouldRespectReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Restores original text content to spans
 */
export function restoreOriginalText(spans: CharacterSpan[]): void {
  spans.forEach((span) => {
    if (span.originalChar) {
      if (span.originalChar === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = span.originalChar;
      }
    }
  });
}

/**
 * Cleans up span elements and restores plain text
 */
export function cleanupSpans(element: HTMLElement, originalText: string): void {
  element.innerHTML = '';
  element.textContent = originalText;
}

/**
 * Generates a sequence of random characters for shuffle effect
 */
export function generateShuffleSequence(
  finalChar: string,
  iterations: number,
  charset: string = DEFAULT_SHUFFLE_CHARS
): string[] {
  const sequence: string[] = [];

  // Generate random characters (excluding the final character to avoid early reveals)
  const availableChars = charset
    .replace(finalChar.toUpperCase(), '')
    .replace(finalChar.toLowerCase(), '');

  for (let i = 0; i < iterations; i++) {
    sequence.push(getRandomCharacter(availableChars));
  }

  // Add the final character
  sequence.push(finalChar);

  return sequence;
}
