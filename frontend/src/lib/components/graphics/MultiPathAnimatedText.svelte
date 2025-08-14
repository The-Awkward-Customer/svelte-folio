<!-- Multi-path animated text component - combines multiple animated text paths with coordinated behavior -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { gsap } from 'gsap';

  // Types
  interface ColorPair {
    background: string;
    foreground: string;
  }

  interface PathStyleConfig {
    strokeColor: string;
    strokeWidth: number;
    opacity: number;
  }

  interface TextStyleConfig {
    font: string;
    size: number;
    color: string;
  }

  interface PathConfig {
    texts: string[];
    speed: number;
    pathWildness?: number;
    verticalBounds?: number;
    showPath?: boolean;
    pathStyle?: Partial<PathStyleConfig>;
    textStyle?: Partial<TextStyleConfig>;
  }

  interface PathData {
    config: PathConfig;
    points: { x: number; y: number }[];
    length: number;
    selectedText: string;
    repeatedText: string;
    textChars: { char: string; width: number }[];
    totalTextWidth: number;
    animationId: gsap.core.Tween | null;
  }

  // Props
  export let paths: PathConfig[] = [];
  export let colorPairs: ColorPair[] = [
    { background: '#0066FF', foreground: '#FFFF00' }, // Electric Blue & Bright Yellow
    { background: '#FF1493', foreground: '#32FF32' }, // Hot Pink & Lime Green
    { background: '#FF4500', foreground: '#9932CC' }, // Orange & Purple
    { background: '#00FFFF', foreground: '#FF00FF' }, // Cyan & Magenta
    { background: '#50C878', foreground: '#FFD700' }, // Emerald & Gold
  ];
  export let fixedCanvasWidth: number = 2560;
  export let verticalStacking: 'random' | 'distributed' | 'overlapping' = 'random';

  // State
  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let ctx: CanvasRenderingContext2D;
  let canvasWidth: number = fixedCanvasWidth;
  let canvasHeight: number = 400;
  let viewportWidth: number = 0;
  let pathsData: PathData[] = [];
  let selectedColorPairs: ColorPair[] = [];

  // Generate smooth random path with organic, obtuse curves (adapted from AnimatedTextPath)
  function generatePath(width: number, height: number, config: PathConfig, verticalOffset: number = 0): { x: number; y: number }[] {
    const pathWildness = config.pathWildness ?? 0.7;
    const verticalBounds = config.verticalBounds ?? 0.1;
    
    const extendedWidth = width * 1.5; // Extend past canvas
    const startX = -width * 0.25;

    // Generate curves with irregular spacing - pathWildness affects curve count
    const baseNumCurves = 4;
    const wildnessRange = Math.floor(pathWildness * 4); // 0-4 additional curves based on wildness
    const numCurves = baseNumCurves + Math.floor(Math.random() * (wildnessRange + 1));
    const points: { x: number; y: number }[] = [];

    // Create irregular spacing
    const spacings: number[] = [];
    let totalSpacing = 0;

    for (let i = 0; i < numCurves; i++) {
      // Random spacing between 0.5 and 1.5 of average
      const spacing = 0.5 + Math.random();
      spacings.push(spacing);
      totalSpacing += spacing;
    }

    // Normalize spacings to fit the extended width
    const normalizedSpacings = spacings.map((s) => (s / totalSpacing) * extendedWidth);

    // Generate control points with organic variation
    let currentX = startX;
    const adjustedMinY = height * verticalBounds + verticalOffset;
    const adjustedMaxY = height * (1 - verticalBounds) + verticalOffset;
    const yRange = adjustedMaxY - adjustedMinY;

    for (let i = 0; i < numCurves; i++) {
      const x = currentX + normalizedSpacings[i] * 0.5; // Place point at middle of spacing

      // Create organic vertical positions with alternating tendency
      let y: number;
      if (i === 0) {
        // Start somewhere in the middle range
        const baseRange = 0.4;
        const wildnessBonus = pathWildness * 0.2; // Up to 20% more variation
        const totalRange = Math.min(baseRange + wildnessBonus, 0.8);
        const startOffset = (1 - totalRange) / 2;
        y = adjustedMinY + yRange * (startOffset + Math.random() * totalRange);
      } else {
        // Alternate between high and low with organic variation
        const previousY = points[i - 1].y;
        const isHigh = previousY > (adjustedMinY + adjustedMaxY) / 2;

        // pathWildness affects how extreme the variations can be
        const baseVariation = 0.35;
        const wildnessVariation = pathWildness * 0.4; // Up to 40% more variation
        const maxVariation = Math.min(baseVariation + wildnessVariation, 0.8);

        if (isHigh) {
          // Go low, but with variation affected by wildness
          y = adjustedMinY + yRange * (Math.random() * maxVariation);
        } else {
          // Go high, but with variation affected by wildness
          y = adjustedMinY + yRange * (1 - maxVariation + Math.random() * maxVariation);
        }
      }

      points.push({ x, y });
      currentX += normalizedSpacings[i];
    }

    // Add extra point at the end for smooth continuation
    points.push({
      x: currentX + width * 0.25,
      y: points[0].y + (Math.random() - 0.5) * yRange * 0.3,
    });

    // Convert control points to very smooth bezier path
    const pathPoints: { x: number; y: number }[] = [];
    const resolution = 5; // Higher resolution for smoother curves

    // Use Catmull-Rom spline for smoother, more organic curves
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const steps = Math.ceil(Math.abs(p2.x - p1.x) / resolution);

      for (let t = 0; t < steps; t++) {
        const ratio = t / steps;

        // Catmull-Rom spline interpolation for smoother curves
        const x = catmullRom(p0.x, p1.x, p2.x, p3.x, ratio);
        const y = catmullRom(p0.y, p1.y, p2.y, p3.y, ratio);

        pathPoints.push({ x, y });
      }
    }

    // Apply smoothing pass to reduce sharp angle changes
    return smoothPath(pathPoints);
  }

  // Catmull-Rom spline interpolation
  function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const t2 = t * t;
    const t3 = t2 * t;

    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    );
  }

  // Smooth the path to reduce sharp changes
  function smoothPath(pathPoints: { x: number; y: number }[]): { x: number; y: number }[] {
    const smoothedPoints: { x: number; y: number }[] = [];
    const windowSize = 5; // Number of points to average

    for (let i = 0; i < pathPoints.length; i++) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      for (let j = -windowSize; j <= windowSize; j++) {
        const index = i + j;
        if (index >= 0 && index < pathPoints.length) {
          // Use gaussian-like weights
          const weight = Math.exp(-(j * j) / (windowSize * 0.5));
          sumX += pathPoints[index].x * weight;
          sumY += pathPoints[index].y * weight;
          count += weight;
        }
      }

      smoothedPoints.push({
        x: sumX / count,
        y: sumY / count,
      });
    }

    return smoothedPoints;
  }

  // Calculate path length
  function calculatePathLength(points: { x: number; y: number }[]): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }

  // Get point and smoothed angle at specific distance along path
  function getPointAtDistance(
    pathData: PathData,
    distance: number
  ): { x: number; y: number; angle: number } {
    const points = pathData.points;
    
    // Ensure distance is positive
    while (distance < 0) distance += pathData.length;
    distance = distance % pathData.length;

    let currentDistance = 0;

    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      if (currentDistance + segmentLength >= distance) {
        const ratio = (distance - currentDistance) / segmentLength;
        const x = points[i - 1].x + dx * ratio;
        const y = points[i - 1].y + dy * ratio;

        // Get smoothed angle by averaging nearby points
        const smoothAngle = getSmoothedAngle(pathData, i - 1, ratio);

        return { x, y, angle: smoothAngle };
      }

      currentDistance += segmentLength;
    }

    // Return last point if distance exceeds path length
    const lastPoint = points[points.length - 1];
    const smoothAngle = getSmoothedAngle(pathData, points.length - 2, 1);
    return { ...lastPoint, angle: smoothAngle };
  }

  // Get smoothed angle by averaging nearby segments
  function getSmoothedAngle(pathData: PathData, segmentIndex: number, _ratio: number): number {
    const points = pathData.points;
    const lookAhead = 15; // Number of points to look ahead/behind for smoothing
    let totalDx = 0;
    let totalDy = 0;
    let count = 0;

    // Look at points before and after current position
    for (let offset = -lookAhead; offset <= lookAhead; offset++) {
      const index = segmentIndex + offset;

      if (index >= 0 && index < points.length - 1) {
        const weight = Math.exp(-(offset * offset) / (lookAhead * 0.5)); // Gaussian weight
        const dx = points[index + 1].x - points[index].x;
        const dy = points[index + 1].y - points[index].y;

        totalDx += dx * weight;
        totalDy += dy * weight;
        count += weight;
      }
    }

    return Math.atan2(totalDy / count, totalDx / count);
  }

  // Create single repeating text string for a path
  function createRepeatedText(pathData: PathData) {
    if (!ctx) return;

    const textStyle = {
      font: 'bold 24px sans-serif',
      size: 24,
      color: '#000000',
      ...pathData.config.textStyle
    };

    // Set font before measuring to ensure accurate character widths
    ctx.font = textStyle.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Create pattern with double space separator for clean separation
    const separator = '  ';
    const pattern = pathData.selectedText + separator;

    // Calculate pattern width
    const patternWidth = ctx.measureText(pattern).width;

    // Store character data
    pathData.textChars = [];
    pathData.totalTextWidth = patternWidth;

    // Measure each character in one pattern
    for (const char of pattern) {
      const width = ctx.measureText(char).width;
      pathData.textChars.push({ char, width });
    }
  }

  // Calculate vertical offsets based on stacking strategy
  function calculateVerticalOffsets(): number[] {
    const offsets: number[] = [];
    
    switch (verticalStacking) {
      case 'distributed':
        // Evenly distribute paths across the height
        for (let i = 0; i < paths.length; i++) {
          const fraction = paths.length > 1 ? i / (paths.length - 1) : 0.5;
          offsets.push((fraction - 0.5) * canvasHeight * 0.6); // Use 60% of height for distribution
        }
        break;
        
      case 'overlapping':
        // All paths use the same vertical space (original behavior)
        offsets.fill(0, 0, paths.length);
        break;
        
      case 'random':
      default:
        // Random vertical offsets
        for (let i = 0; i < paths.length; i++) {
          offsets.push((Math.random() - 0.5) * canvasHeight * 0.4); // Use 40% of height for random variation
        }
        break;
    }
    
    return offsets;
  }

  // Render frame for all paths
  function render() {
    if (!ctx || !canvas || pathsData.length === 0) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate center offset for viewport
    const centerOffset = (canvasWidth - viewportWidth) / 2;

    // Render each path
    pathsData.forEach((pathData, pathIndex) => {
      const config = pathData.config;
      const colorPair = selectedColorPairs[pathIndex];
      
      const pathStyle = {
        strokeColor: '#cccccc',
        strokeWidth: 2,
        opacity: 0.5,
        ...config.pathStyle
      };

      const textStyle = {
        font: 'bold 24px sans-serif',
        size: 24,
        color: '#000000',
        ...config.textStyle
      };

      // Override colors with selected color pair if available
      if (colorPair) {
        pathStyle.strokeColor = colorPair.background;
        textStyle.color = colorPair.foreground;
      }

      const showPath = config.showPath ?? true;
      const progress = pathData.animationId?.progress() ?? 0;

      // Draw the path stroke first (behind text)
      if (showPath) {
        ctx.save();
        ctx.strokeStyle = pathStyle.strokeColor;
        ctx.lineWidth = pathStyle.strokeWidth;
        ctx.globalAlpha = pathStyle.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        let started = false;

        for (let i = 0; i < pathData.points.length; i++) {
          const point = pathData.points[i];
          if (!started) {
            ctx.moveTo(point.x, point.y);
            started = true;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }

        ctx.stroke();
        ctx.restore();
      }

      // Set text style
      ctx.font = textStyle.font;
      ctx.fillStyle = textStyle.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate how much to offset based on progress (left to right movement)
      const offset = -(progress * pathData.length) % pathData.totalTextWidth;

      // Start drawing from before the visible area to ensure smooth entry
      let currentDistance = -offset;

      // Keep drawing pattern instances until we've covered the entire path
      while (currentDistance < pathData.length + pathData.totalTextWidth) {
        // Draw one instance of the pattern
        let charPosition = 0;

        for (const { char, width } of pathData.textChars) {
          const distance = currentDistance + charPosition;

          // Only process characters that are on the path
          if (distance >= 0 && distance <= pathData.length) {
            const point = getPointAtDistance(pathData, distance);

            // Only render if in viewport (with margin for smooth entry/exit)
            if (
              point.x > centerOffset - 200 &&
              point.x < centerOffset + viewportWidth + 200
            ) {
              ctx.save();
              ctx.translate(point.x, point.y);
              ctx.rotate(point.angle);
              ctx.fillText(char, 0, 0);
              ctx.restore();
            }
          }

          charPosition += width;
        }

        // Move to next pattern instance
        currentDistance += pathData.totalTextWidth;
      }
    });
  }

  // Setup canvas and all paths
  function setup() {
    if (!browser || !canvas || !container) return;

    ctx = canvas.getContext('2d')!;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    canvasHeight = rect.height;
    viewportWidth = rect.width;

    // Set fixed canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    // Scale for DPR
    ctx.scale(dpr, dpr);

    // Select random color pairs for each path
    selectedColorPairs = Array.from({ length: paths.length }, () => {
      return colorPairs[Math.floor(Math.random() * colorPairs.length)];
    });

    // Calculate vertical offsets
    const verticalOffsets = calculateVerticalOffsets();

    // Initialize all path data
    pathsData = paths.map((config, index) => {
      const selectedText = config.texts[Math.floor(Math.random() * config.texts.length)];
      const points = generatePath(canvasWidth, canvasHeight, config, verticalOffsets[index]);
      const length = calculatePathLength(points);

      const pathData: PathData = {
        config,
        points,
        length,
        selectedText,
        repeatedText: '',
        textChars: [],
        totalTextWidth: 0,
        animationId: null
      };

      // Create repeated text for this path
      createRepeatedText(pathData);

      // Setup GSAP animation for this path
      const duration = length / config.speed;
      pathData.animationId = gsap.to(
        { progress: 0 },
        {
          progress: 1,
          duration,
          ease: 'none',
          repeat: -1,
          onUpdate: render
        }
      );

      return pathData;
    });
  }

  // Handle resize - only updates viewport tracking
  function handleResize() {
    if (!browser || !container) return;
    const rect = container.getBoundingClientRect();
    viewportWidth = rect.width;
    // Re-render at current state
    render();
  }

  onMount(() => {
    if (browser) {
      setup();
      window.addEventListener('resize', handleResize);
    }
  });

  onDestroy(() => {
    if (browser) {
      pathsData.forEach(pathData => {
        if (pathData.animationId) pathData.animationId.kill();
      });
      window.removeEventListener('resize', handleResize);
    }
  });
</script>

<div class="multi-path-animated-text-container" bind:this={container}>
  <div class="canvas-wrapper">
    <canvas bind:this={canvas} class="multi-path-animated-text" aria-hidden="true"></canvas>
  </div>
  <div class="sr-only">
    {#each pathsData as pathData}
      {pathData.selectedText}
    {/each}
  </div>
</div>

<style>
  .multi-path-animated-text-container {
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: visible;
    z-index: -999;
    top: 0;
  }

  .canvas-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2560px; /* Match fixedCanvasWidth prop */
    height: 100%;
  }

  .multi-path-animated-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .multi-path-animated-text {
      display: none;
    }
  }
</style>