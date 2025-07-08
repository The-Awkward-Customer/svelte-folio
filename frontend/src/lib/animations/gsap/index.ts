/**
 * GSAP Animations Module
 *
 * This module provides modular animation functions using GSAP
 * for use in Svelte 5 components.
 */

// Export main animation functions
export { shuffleText, waveText, typewriterText } from './textAnimations.js';
export { createGlitchAnimation } from './glitchAnimations.js';

// Export utility functions
export { 
  splitTextToSpans, 
  getRandomCharacter, 
  shouldRespectReducedMotion,
  restoreOriginalText,
  cleanupSpans,
  generateShuffleSequence,
  DEFAULT_SHUFFLE_CHARS
} from './utils.js';

// Export types
export type { 
  TextAnimationOptions,
  ShuffleOptions,
  WaveOptions,
  AnimationState,
  CharacterSpan
} from './types.js';

/**
 * Quick setup function for common use cases
 */
export const textAnimations = {
  shuffle: (element: HTMLElement, text: string, options = {}) => 
    import('./textAnimations.js').then(({ shuffleText }) => shuffleText(element, text, options)),
  
  wave: (element: HTMLElement, text: string, options = {}) =>
    import('./textAnimations.js').then(({ waveText }) => waveText(element, text, options)),
    
  typewriter: (element: HTMLElement, text: string, options = {}) =>
    import('./textAnimations.js').then(({ typewriterText }) => typewriterText(element, text, options))
};