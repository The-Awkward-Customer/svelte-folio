#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)

echo "Scanning source for raw console.* calls..."
if grep -RIn --exclude-dir=node_modules --exclude-dir=.git -E "\bconsole\.(log|info|warn|error|debug|trace|table)\b" "$ROOT_DIR/frontend/src"; then
  echo "Error: Found raw console.* calls in source. Use $lib/utils/logger instead." >&2
  exit 1
else
  echo "OK: No raw console.* calls found in source."
fi

BUILD_DIR="$ROOT_DIR/frontend/build"
if [ -d "$BUILD_DIR" ]; then
  echo "Scanning build output for console statements..."
  if grep -RIn -E "console\.[a-z]+\(" "$BUILD_DIR"; then
    echo "Warning: console statements detected in build output." >&2
    exit 2
  else
    echo "OK: No console statements in build output."
  fi
else
  echo "Note: Build directory not found; skipping build scan."
fi

