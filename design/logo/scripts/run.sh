#!/bin/bash
# Draws the TRAIL Club logo in Adobe Illustrator and copies the web assets into public/brand/.
# Usage: design/logo/scripts/run.sh   (Illustrator must be installed; it is launched if needed)
set -euo pipefail
LOGO_DIR=$(cd "$(dirname "$0")/.." && pwd)        # design/logo
SITE_DIR=$(cd "$LOGO_DIR/../.." && pwd)
EXPORT_DIR="$LOGO_DIR/export"
mkdir -p "$EXPORT_DIR" "$SITE_DIR/public/brand"
TMP="$LOGO_DIR/scripts/.build.jsx"
{
  echo "var LOGO_DIR = \"$LOGO_DIR\";"
  echo "var EXPORT_DIR = \"$EXPORT_DIR\";"
  cat "$LOGO_DIR/scripts/lib.jsx" "$LOGO_DIR/scripts/g1.jsx"
} > "$TMP"
osascript -e "with timeout of 1200 seconds" \
  -e "tell application id \"com.adobe.illustrator\" to do javascript (POSIX file \"$TMP\")" \
  -e "end timeout"
echo
rm -f "$TMP"

# Illustrator puts exports in format subfolders; find them by name.
copy() { # copy <exported file name> <name in public/brand>
  local src; src=$(find "$EXPORT_DIR" -type f -name "$1" | head -1)
  if [ -z "$src" ]; then echo "missing export: $1" >&2; exit 1; fi
  cp "$src" "$SITE_DIR/public/brand/$2"
}
for f in logo logo-dark logo-mono mark favicon; do copy "$f.svg" "$f.svg"; done
copy "apple-touch-icon.png" "apple-touch-icon.png"
copy "og.png" "og.png"
ls -l "$SITE_DIR/public/brand"
