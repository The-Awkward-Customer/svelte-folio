/**
 * Animation manifest structure from manifest.json
 */
export type AnimationManifest = {
  [key: string]: {
    frameCount: number;
    duration: number;
    fps: number;
    description: string;
    format: 'svg';  // SVG only
    viewBox?: string;  // SVG viewBox for consistent scaling
    preserveAspectRatio?: string;
  };
};

/**
 * Loaded animation sequence with frames
 */
export type AnimationSequence = {
  name: string;
  frames: HTMLImageElement[];
  frameCount: number;
  duration: number;
  fps: number;
  description: string;
};

/**
 * Options for rendering animations
 */
export type RenderOptions = {
  trigger: 'auto' | 'viewport' | 'hover' | 'click' | 'manual';
  loop?: boolean;
  delay?: number;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  respectReducedMotion?: boolean;
  onStateChange?: (state: AnimationState) => void;
};

/**
 * Animation state for tracking loading and playback
 */
export type AnimationState = {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentFrame: number;
  error?: Error;
};
