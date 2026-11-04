#!/usr/bin/env bash
# Fails if UI code uses raw colors or the visual patterns the redesign removed.
# Colors belong in app/globals.css tokens; everything else uses token classes.

set -u
cd "$(dirname "$0")/.."

patterns=(
  'bg-gradient-|from-\[#|to-\[#|gradient-text'
  'backdrop-blur'
  'hover:-translate-y|hover:scale-'
  'uppercase[^"]*tracking-\[0\.1'
  '#[0-9a-fA-F]{6}\b'
  'rgba?\('
)

status=0
for pattern in "${patterns[@]}"; do
  matches=$(grep -rnE "$pattern" app components --include='*.tsx' --include='*.ts' 2>/dev/null)
  if [ -n "$matches" ]; then
    count=$(printf '%s\n' "$matches" | wc -l | tr -d ' ')
    echo "✗ $count match(es) for /$pattern/"
    printf '%s\n' "$matches" | head -5 | sed 's/^/    /'
    status=1
  fi
done

[ "$status" -eq 0 ] && echo "✓ UI check passed"
exit "$status"
