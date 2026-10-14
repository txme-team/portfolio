#!/bin/bash
# 소구점 아이콘을 다시 그린다: scripts/render-icons.html → public/icons/y2k-{gear,chart,puzzle}.webp
# 크롬(헤드리스)과 python3 + Pillow 가 필요하다.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for icon in gear chart puzzle; do
  "$CHROME" --headless=new --user-data-dir="$TMP/profile" \
    --allow-file-access-from-files --use-angle=metal --ignore-gpu-blocklist \
    --hide-scrollbars --default-background-color=00000000 \
    --window-size=512,512 --force-device-scale-factor=2 \
    --virtual-time-budget=5000 \
    --screenshot="$TMP/$icon.png" \
    "file://$PWD/scripts/render-icons.html?icon=$icon" >/dev/null 2>&1
  python3 - "$TMP/$icon.png" "public/icons/y2k-$icon.webp" <<'EOF'
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGBA")
im.save(sys.argv[2], "WEBP", lossless=True, method=6)
print(sys.argv[2], im.size, "alpha", im.getextrema()[3])
EOF
done
