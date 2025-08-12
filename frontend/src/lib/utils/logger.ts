import { dev, browser } from '$app/environment';

type Level = 'debug' | 'info' | 'warn' | 'error';

const order: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function getLevel(): Level {
  const raw = (import.meta as any).env?.PUBLIC_LOG_LEVEL as string | undefined;
  // Default: dev → debug, prod → warn
  if (!raw) return dev ? 'debug' : 'warn';
  const val = raw.toLowerCase();
  if (val === 'debug' || val === 'info' || val === 'warn' || val === 'error')
    return val;
  return dev ? 'debug' : 'warn';
}

const activeLevel = getLevel();

function shouldLog(level: Level) {
  // In production browser bundles, respect level strictly; on server or in dev, allow per level
  return order[level] >= order[activeLevel];
}

function makeLogger(prefix?: string) {
  return {
    debug: (...args: unknown[]) => {
      if (shouldLog('debug'))
        console.debug(prefix ? `[${prefix}]` : undefined, ...args);
    },
    info: (...args: unknown[]) => {
      if (shouldLog('info'))
        console.info(prefix ? `[${prefix}]` : undefined, ...args);
    },
    warn: (...args: unknown[]) => {
      if (shouldLog('warn'))
        console.warn(prefix ? `[${prefix}]` : undefined, ...args);
    },
    error: (...args: unknown[]) => {
      if (shouldLog('error'))
        console.error(prefix ? `[${prefix}]` : undefined, ...args);
    },
  };
}

export const logger = makeLogger('app');
export const createLogger = makeLogger;
