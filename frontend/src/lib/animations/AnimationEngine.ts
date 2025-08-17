import type {
  AnimationManifest,
  AnimationSequence,
  RenderOptions,
  AnimationState,
} from '$lib/animations/types';

export class AnimationEngine {
  private manifest: AnimationManifest = {};
  private loadedAnimations: Map<string, AnimationSequence> = new Map();
  private preloadedImages: Map<string, HTMLImageElement[]> = new Map();
  private manifestLoaded: boolean = false;

  constructor() {
    this.checkReducedMotion();
    this.loadManifest();
  }

  /**
   * Loads the animation manifest from the static folder
   */
  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch('/animations/manifest.json');
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.statusText}`);
      }
      this.manifest = await response.json();
      this.manifestLoaded = true;
      console.log('Animation manifest loaded:', this.manifest);
    } catch (error) {
      console.error('Error loading animation manifest:', error);
      throw error;
    }
  }

  /**
   * Ensures manifest is loaded before proceeding
   */
  private async ensureManifestLoaded(): Promise<void> {
    if (!this.manifestLoaded) {
      await this.loadManifest();
    }
  }

  /**
   * Preloads all SVG frames for a given animation
   */
  private async preloadFrames(
    name: string,
    frameCount: number
  ): Promise<HTMLImageElement[]> {
    const frames: HTMLImageElement[] = [];
    const loadPromises: Promise<void>[] = [];

    for (let i = 0; i < frameCount; i++) {
      const paddedIndex = i.toString().padStart(5, '0');

      const loadPromise = new Promise<void>(async (resolve, reject) => {
        try {
          // Load SVG from static folder
          const svgResponse = await fetch(
            `/animations/${name}/${paddedIndex}.svg`
          );
          if (!svgResponse.ok) {
            console.warn(
              `Failed to fetch SVG frame ${i} for animation ${name}`
            );
            resolve();
            return;
          }

          const svgText = await svgResponse.text();
          const img = await this.renderSVGToImage(svgText, 512, 512); // Default size, will be scaled later
          frames[i] = img;
          resolve();
        } catch (error) {
          console.warn(
            `Failed to load frame ${i} for animation ${name}:`,
            error
          );
          resolve(); // Resolve anyway to continue loading other frames
        }
      });

      loadPromises.push(loadPromise);
    }

    await Promise.all(loadPromises);
    return frames;
  }

  /**
   * Converts SVG string to HTMLImageElement for canvas rendering
   */
  private async renderSVGToImage(
    svgString: string,
    width: number,
    height: number
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url); // Clean up blob URL
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url); // Clean up blob URL
        reject(new Error('Failed to load SVG as image'));
      };
      img.src = url;
    });
  }

  /**
   * Loads an animation sequence by name
   */
  public async loadAnimation(name: string): Promise<AnimationSequence> {
    console.log(`Loading animation: ${name}`);
    if (this.loadedAnimations.has(name)) {
      console.log(`Using cached animation: ${name}`);
      return this.loadedAnimations.get(name)!;
    }

    // Ensure manifest is loaded before proceeding
    await this.ensureManifestLoaded();

    const animationData = this.manifest[name];

    if (!animationData) {
      console.error(`Animation "${name}" not found in manifest`);
      throw new Error(`Animation "${name}" not found in manifest`);
    }

    console.log(`Found animation data:`, animationData);

    try {
      const frames = await this.preloadFrames(name, animationData.frameCount);

      const sequence: AnimationSequence = {
        name,
        frames,
        frameCount: animationData.frameCount,
        duration: animationData.duration,
        fps: animationData.fps,
        description: animationData.description,
      };

      this.loadedAnimations.set(name, sequence);
      this.preloadedImages.set(name, frames);

      return sequence;
    } catch (error) {
      console.error(`Error loading animation "${name}":`, error);
      throw error;
    }
  }

  /**
   * Creates a renderer for a canvas element
   */
  public createRenderer(canvas: HTMLCanvasElement, options: RenderOptions) {
    return new AnimationRenderer(canvas, options);
  }

  /**
   * Preloads multiple animations simultaneously
   */
  public async preloadAll(animations: string[]): Promise<void> {
    try {
      await Promise.all(animations.map((name) => this.loadAnimation(name)));
    } catch (error) {
      console.error('Error preloading animations:', error);
      throw error;
    }
  }

  /**
   * Checks if reduced motion is preferred
   */
  public checkReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Cleans up resources for an animation
   */
  public unloadAnimation(name: string): void {
    this.loadedAnimations.delete(name);
    this.preloadedImages.delete(name);
  }
}

export class AnimationRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentFrame: number = 0;
  private state: AnimationState = {
    isLoading: true,
    isPlaying: false,
    isPaused: false,
    currentFrame: 0,
  };
  private lastFrameTime: number = 0;
  private sequence: AnimationSequence | null = null;
  private options: RenderOptions;

  private updateState(newState: Partial<AnimationState>) {
    this.state = { ...this.state, ...newState };
    this.options.onStateChange?.(this.state);
  }

  constructor(canvas: HTMLCanvasElement, options: RenderOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    this.ctx = ctx;
    this.options = options;

    // Set up intersection observer for viewport-based triggering
    if (options.trigger === 'viewport') {
      this.setupIntersectionObserver();
    }
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.play();
          } else {
            this.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.canvas);
  }

  public setSequence(sequence: AnimationSequence): void {
    console.log('Setting animation sequence:', sequence);
    this.sequence = sequence;
    this.updateState({
      currentFrame: 0,
      isLoading: false,
    });
    this.render();
  }

  public render(): void {
    if (!this.sequence || !this.sequence.frames[this.currentFrame]) {
      console.warn('Render called but sequence or frame is not available');
      return;
    }

    const frame = this.sequence.frames[this.currentFrame];
    console.log(
      `Rendering frame ${this.currentFrame}, canvas size: ${this.canvas.width}x${this.canvas.height}`
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate scaling to maintain aspect ratio
    const scale = Math.min(
      this.canvas.width / frame.width,
      this.canvas.height / frame.height
    );

    const width = frame.width * scale;
    const height = frame.height * scale;
    const x = (this.canvas.width - width) / 2;
    const y = (this.canvas.height - height) / 2;

    console.log(
      `Drawing frame with dimensions: ${width}x${height} at position ${x},${y}`
    );
    this.ctx.drawImage(frame, x, y, width, height);
  }

  private animate(timestamp: number): void {
    if (!this.state.isPlaying || !this.sequence) return;

    const elapsed = timestamp - this.lastFrameTime;
    const frameTime = 1000 / this.sequence.fps;

    if (elapsed >= frameTime) {
      this.currentFrame = (this.currentFrame + 1) % this.sequence.frameCount;
      this.render();
      this.lastFrameTime = timestamp;
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  public play(): void {
    console.log('Play called');
    if (!this.state.isPlaying) {
      console.log('Starting animation playback');
      this.updateState({ isPlaying: true, isPaused: false });
      this.lastFrameTime = performance.now();
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  public pause(): void {
    this.updateState({ isPlaying: false, isPaused: true });
  }

  public setTrigger(
    type: 'auto' | 'viewport' | 'hover' | 'click' | 'manual'
  ): void {
    this.options.trigger = type;
    if (type === 'viewport') {
      this.setupIntersectionObserver();
    }
  }

  public respectReducedMotion(enabled: boolean): void {
    if (
      enabled &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.pause();
    }
  }
}
