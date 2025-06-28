/**
 * Base options for all text animations
 */
export interface TextAnimationOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  respectReducedMotion?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
}

/**
 * Options specific to character shuffle animation
 */
export interface ShuffleOptions extends TextAnimationOptions {
  iterations?: number;        // Number of random character cycles (default: 4)
  characters?: string;        // Character set for randomization
  preserveSpaces?: boolean;   // Keep spaces intact during animation
  startDelay?: number;        // Delay before starting the shuffle
}

/**
 * Options for wave motion animation (future implementation)
 */
export interface WaveOptions extends TextAnimationOptions {
  amplitude?: number;         // Wave height in pixels
  frequency?: number;         // Wave speed multiplier
  direction?: 'up' | 'down' | 'both';
}

/**
 * Animation state tracking
 */
export interface AnimationState {
  isAnimating: boolean;
  isPaused: boolean;
  progress: number;
  element: HTMLElement | null;
}

/**
 * Character span element with original character data
 */
export interface CharacterSpan extends HTMLSpanElement {
  originalChar?: string;
  charIndex?: number;
}