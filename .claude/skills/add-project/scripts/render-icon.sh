#!/usr/bin/env bash
# Render an icon.svg to a PNG so it can be looked at (SVGs can't be viewed directly).
#
# usage: render-icon.sh <icon.svg> <out-dir> [size]
# Writes <out-dir>/<name>.svg.png at size x size (default 256) using macOS QuickLook.
set -euo pipefail
svg="${1:?usage: render-icon.sh <icon.svg> <out-dir> [size]}"
dir="${2:?usage: render-icon.sh <icon.svg> <out-dir> [size]}"
size="${3:-256}"
mkdir -p "$dir"
qlmanage -t -s "$size" -o "$dir" "$svg" >/dev/null 2>&1 || true
png="$dir/$(basename "$svg").png"
if [ ! -s "$png" ]; then
  echo "error: could not render $svg (is it valid SVG?)" >&2
  exit 1
fi
echo "$png"
