import { writable } from 'svelte/store';

interface MouseState {
  x: number;
  y: number;
  isActive: boolean;
}

const createMouseManager = () => {
  const { subscribe, update } = writable<MouseState>({
    x: 0,
    y: 0,
    isActive: false
  });

  let isInitialized = false;

  const init = () => {
    if (isInitialized || typeof window === 'undefined') return;
    
    const handleMouseMove = (event: MouseEvent) => {
      update(state => ({
        ...state,
        x: event.clientX,
        y: event.clientY,
        isActive: true
      }));
    };

    const handleMouseLeave = () => {
      update(state => ({ ...state, isActive: false }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    isInitialized = true;
  };

  // Initialize immediately if window is available
  if (typeof window !== 'undefined') {
    init();
  }

  return {
    subscribe,
    init
  };
};

export const mouseManager = createMouseManager();