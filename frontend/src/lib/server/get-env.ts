// Helper to get environment variables that works both in SvelteKit and Node scripts

export function getEnvVariable(name: string): string {
  // In Node scripts, use process.env
  if (typeof process !== 'undefined' && process.env[name]) {
    return process.env[name];
  }

  // In SvelteKit, this will be handled by the build process
  // The actual import from $env/static/private should be done in the route handlers
  throw new Error(`Environment variable ${name} is not set`);
}
