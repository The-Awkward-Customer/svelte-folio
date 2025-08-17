# Experimental Components

This directory contains components that are actively being developed and tested.

## Status: EXPERIMENTAL

**⚠️ Important:** These components are not stable and may change or be removed without notice.

## Current Components

### Dialog Components
- `TestOne.svelte` - Dialog test component (used in production dialog system)
- `TestTwo.svelte` - Dialog test component (used in production dialog system)  
- `TestThree.svelte` - Dialog test component (used in production dialog system)

## Usage

These components are currently integrated into the main dialog system via `overlays/dialog/Root.svelte`. While they are marked as experimental, they are actively used in the application.

## Component Lifecycle

Components in this directory should follow the experimental → stable promotion path:

1. **Experimental** - Active development, may change
2. **Alpha** - Feature complete, needs testing
3. **Beta** - Testing phase, API likely stable
4. **Stable** - Ready for production use

## Moving to Stable

When components are ready for production:
1. Move to appropriate stable directory
2. Update imports throughout codebase
3. Add to main component exports
4. Update documentation