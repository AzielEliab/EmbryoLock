#!/usr/bin/env bash
# EmbryoLock one-click install. Counted download via this project's Worker.
# Usage: curl -fsSL https://embryolock-download-tracker.vibelock.workers.dev/install.sh | bash
# Local vault only. Wipe/scorch never run on the public Worker.
# Author: Aziel Eliab only.
set -euo pipefail

HOST="${EMBRYOLOCK_HOME_HOST:-https://embryolock-download-tracker.vibelock.workers.dev}"
ASSET="${EMBRYOLOCK_HOME_ASSET:-embryolock-1.2.0.tar.gz}"
WORKDIR="${EMBRYOLOCK_HOME:-$HOME/embryolock}"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "Downloading counted tarball from ${HOST}/download (User-Agent Mozilla/5.0)…"
curl -fsSL -A 'Mozilla/5.0' "${HOST}/download?asset=${ASSET}" -o "${ASSET}"

tar -xzf "${ASSET}"
DIR="$(find . -maxdepth 1 -type d \( -name 'embryolock-*' -o -name 'EmbryoLock-*' \) | head -n 1)"
if [ -n "${DIR}" ]; then
  cd "${DIR}"
fi

python3 -m pip install -U pip >/dev/null 2>&1 || true
python3 -m pip install cryptography argon2-cffi

echo
echo "Installed EmbryoLock (local vault)."
echo "Run the local Python vault on this computer only."
echo "If the source file is present: python3 \"Open Source Code\""
echo "Wipe/scorch stay local. The public Worker never executes them."
echo "Author: Aziel Eliab."
