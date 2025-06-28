import { gsap } from 'gsap';
import type { ShuffleOptions, WaveOptions, CharacterSpan } from './types.js';
import { 
  splitTextToSpans, 
  shouldRespectReducedMotion, 
  generateShuffleSequence,
  cleanupSpans,
  DEFAULT_SHUFFLE_CHARS
} from './utils.js';

/**
 * Default options for shuffle animation
 */
const DEFAULT_SHUFFLE_OPTIONS: Required<ShuffleOptions> = {
  duration: 1.2,
  delay: 0,
  stagger: 0.05,
  ease: 'power2.out',
  iterations: 4,
  characters: DEFAULT_SHUFFLE_CHARS,
  preserveSpaces: true,
  startDelay: 0,
  respectReducedMotion: true,
  onComplete: () => {},
  onStart: () => {}
};

/**
 * Creates a character shuffle animation on the given element
 * 
 * @param element - The HTML element containing the text to animate
 * @param text - The text content to animate
 * @param options - Animation options
 * @returns GSAP Timeline instance
 */
export function shuffleText(
  element: HTMLElement, 
  text: string, 
  options: ShuffleOptions = {}
): gsap.core.Timeline {
  const opts = { ...DEFAULT_SHUFFLE_OPTIONS, ...options };
  
  // Check for reduced motion preference
  if (opts.respectReducedMotion && shouldRespectReducedMotion()) {
    // Just set the text immediately without animation
    element.textContent = text;
    opts.onComplete();
    return gsap.timeline();
  }

  // Create timeline
  const tl = gsap.timeline({
    delay: opts.startDelay,
    onStart: opts.onStart,
    onComplete: () => {
      // Clean up spans and restore original text
      cleanupSpans(element, text);
      opts.onComplete();
    }
  });

  // Split text into character spans
  const spans = splitTextToSpans(element, text);
  
  // Filter out spaces if preserveSpaces is true
  const animatableSpans = opts.preserveSpaces 
    ? spans.filter(span => !span.classList.contains('gsap-space'))
    : spans;

  // Create shuffle animation for each character
  animatableSpans.forEach((span, index) => {
    const originalChar = span.originalChar || '';
    
    // Skip if it's a space and we're preserving spaces
    if (originalChar === ' ' && opts.preserveSpaces) {
      return;
    }

    // Generate shuffle sequence for this character
    const shuffleSequence = generateShuffleSequence(
      originalChar, 
      opts.iterations, 
      opts.characters
    );

    // Create animation for this character
    const charTimeline = gsap.timeline();
    
    // Animate through each character in the shuffle sequence
    shuffleSequence.forEach((char, charIndex) => {
      charTimeline.to(span, {
        duration: opts.duration / (opts.iterations + 1),
        ease: opts.ease,
        onUpdate: () => {
          span.textContent = char;
        }
      });
    });

    // Add character animation to main timeline with stagger
    tl.add(charTimeline, index * opts.stagger + opts.delay);
  });

  return tl;
}

/**
 * Creates a wave motion animation on text characters
 * (Placeholder for future implementation)
 * 
 * @param element - The HTML element containing the text to animate
 * @param text - The text content to animate  
 * @param options - Animation options
 * @returns GSAP Timeline instance
 */
export function waveText(
  element: HTMLElement,
  text: string,
  options: WaveOptions = {}
): gsap.core.Timeline {
  // Placeholder implementation
  console.log('Wave animation not yet implemented');
  return gsap.timeline();
}

/**
 * Utility function to create a simple typewriter effect
 * (Bonus implementation for future use)
 */
export function typewriterText(
  element: HTMLElement,
  text: string,
  options: { duration?: number; delay?: number } = {}
): gsap.core.Timeline {
  const { duration = 2, delay = 0 } = options;
  
  if (shouldRespectReducedMotion()) {
    element.textContent = text;
    return gsap.timeline();
  }

  const tl = gsap.timeline({ delay });
  
  // Clear element
  element.textContent = '';
  
  // Add each character progressively
  for (let i = 0; i <= text.length; i++) {
    tl.to(element, {
      duration: duration / text.length,
      ease: 'none',
      onUpdate: () => {
        element.textContent = text.substring(0, i);
      }
    });
  }
  
  return tl;
}