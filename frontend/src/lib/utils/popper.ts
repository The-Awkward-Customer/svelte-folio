export type Position = 'top' | 'bottom' | 'left' | 'right';

export interface PopperOptions {
  position: Position;
  offset: number;
}

export interface PopperResult {
  position: Position;
  top: number;
  left: number;
}

interface ViewportBounds {
  width: number;
  height: number;
}

export function positionWrapper(
  triggerElement: HTMLElement,
  wrapperElement: HTMLElement
): void {
  const triggerRect = triggerElement.getBoundingClientRect();
  
  Object.assign(wrapperElement.style, {
    position: 'fixed',
    top: `${Math.round(triggerRect.top)}px`,
    left: `${Math.round(triggerRect.left)}px`,
    width: `${triggerRect.width}px`,
    height: `${triggerRect.height}px`,
    pointerEvents: 'none',
    zIndex: '999'
  });
}

export function calculatePosition(
  triggerElement: HTMLElement,
  contentElement: HTMLElement,
  options: PopperOptions
): PopperResult {
  const { position, offset } = options;
  const triggerRect = triggerElement.getBoundingClientRect();
  
  // Reset content element for measurement
  Object.assign(contentElement.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    visibility: 'hidden',
    pointerEvents: 'none'
  });
  
  // Force layout
  void contentElement.offsetHeight;
  
  const contentWidth = contentElement.offsetWidth;
  const contentHeight = contentElement.offsetHeight;
  
  const viewport: ViewportBounds = {
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 1000
  };

  const positions: Record<Position, { top: number; left: number }> = {
    top: {
      top: -contentHeight - offset,
      left: (triggerRect.width - contentWidth) / 2
    },
    bottom: {
      top: triggerRect.height + offset,
      left: (triggerRect.width - contentWidth) / 2
    },
    left: {
      top: (triggerRect.height - contentHeight) / 2,
      left: -contentWidth - offset
    },
    right: {
      top: (triggerRect.height - contentHeight) / 2,
      left: triggerRect.width + offset
    }
  };

  function fitsInViewport(side: Position): boolean {
    const pos = positions[side];
    const absoluteTop = triggerRect.top + pos.top;
    const absoluteLeft = triggerRect.left + pos.left;
    
    return (
      absoluteTop >= 8 && // Small padding from viewport edge
      absoluteLeft >= 8 &&
      absoluteTop + contentHeight <= viewport.height - 8 &&
      absoluteLeft + contentWidth <= viewport.width - 8
    );
  }

  // Find best position
  let selectedPosition: Position = position;
  
  if (!fitsInViewport(position)) {
    const opposites: Record<Position, Position> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    };
    
    const opposite = opposites[position];
    if (fitsInViewport(opposite)) {
      selectedPosition = opposite;
    } else {
      // Try remaining positions
      const fallbackOrder: Position[] = 
        position === 'top' || position === 'bottom' 
          ? ['left', 'right'] 
          : ['bottom', 'top'];
      
      for (const pos of fallbackOrder) {
        if (fitsInViewport(pos)) {
          selectedPosition = pos;
          break;
        }
      }
    }
  }

  const finalPos = positions[selectedPosition];
  
  return {
    position: selectedPosition,
    top: Math.round(finalPos.top),
    left: Math.round(finalPos.left)
  };
}

export function applyPosition(
  contentElement: HTMLElement,
  result: PopperResult
): void {
  Object.assign(contentElement.style, {
    position: 'absolute',
    top: `${result.top}px`,
    left: `${result.left}px`,
    visibility: 'visible',
    pointerEvents: 'auto'
  });
}